import React, { useState, Fragment, useEffect, useMemo } from 'react';
import { enumsBoolean2, productType } from '../../config';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { productPage, findContractDealerPage, getDealerByBoxCodeOrBotCode } from '../service';
import { Table, Button, Space, Select, Input, DatePicker, Modal, InputNumber, message, Spin } from 'antd';
import moment from 'moment';
import { cloneDeep, debounce } from 'lodash';
const { TextArea } = Input;
const style = { width: '100%' };
const format = 'YYYY-MM-DD HH:mm:ss';

function QueryCodeForm({ dataSource, setDataSource, branchCode, disabled }) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dealerOptions, setDealerOptions] = useState([]);
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 48,
      align: 'center',
      fixed: 'left',
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '产品',
      width: 300,
      dataIndex: 'productCode',
      fixed: 'left',
      render: (text, record, index) => (
        <ProductSelect
          disabled={disabled || record.forensiscId || false}
          onChange={(e) => {
            let newDataSource = cloneDeep(dataSource);
            newDataSource[index].productCode = e.productCode;
            newDataSource[index].productName = e.productName;
            newDataSource[index].channelCode = e.channelCode;
            newDataSource[index].channelName = e.channelName;
            setDataSource(newDataSource);
          }}
          value={text ? { label: record.productName, value: record.productCode } : undefined}
        />
      ),
    },
    {
      title: '箱码',
      dataIndex: 'boxCode',
      width: 200,
      render: (text, record, index) => (
        <TextArea
          autoSize
          value={text}
          onChange={async (e) => {
            let newDataSource = cloneDeep(dataSource);
            if (newDataSource[index].botProductionDate) {
              newDataSource[index].botProductionDate = null;
            }
            newDataSource[index].boxCode = e.target.value;
            setDataSource(newDataSource);
          }}
          onBlur={(e) => getDealerOptions({ botCode: e.target.value }, index)}
          placeholder='请输入箱码'
          disabled={disabled || record.botCode || false}
        />
      ),
    },
    {
      title: '瓶码',
      dataIndex: 'botCode',
      width: 200,
      render: (text, record, index) => (
        <TextArea
          autoSize
          value={text}
          onChange={async (e) => {
            let newDataSource = cloneDeep(dataSource);
            if (newDataSource[index].boxProductionDate) {
              newDataSource[index].boxProductionDate = null;
            }
            newDataSource[index].botCode = e.target.value;
            // 获取经销商
            setDataSource(newDataSource);
          }}
          onBlur={(e) => getDealerOptions({ botCode: e.target.value }, index)}
          placeholder='请输入瓶码'
          disabled={disabled || record.boxCode || false}
        />
      ),
    },
    {
      title: '箱生产日期',
      dataIndex: 'boxProductionDate',
      width: 200,
      render: (text, record, index) => (
        <DatePicker
          style={style}
          onChange={(e) => {
            const value = e ? e.format(format) : null;
            colChangeValue(value, 'boxProductionDate', index);
          }}
          disabled={disabled || record.botCode || false}
          value={text ? moment(text) : undefined}
          format={format}
        />
      ),
    },
    {
      title: '瓶生产日期',
      dataIndex: 'botProductionDate',
      width: 200,
      render: (text, record, index) => (
        <DatePicker
          style={style}
          onChange={(e) => {
            const value = e ? e.format(format) : null;
            colChangeValue(value, 'botProductionDate', index);
          }}
          disabled={disabled || record.boxCode || false}
          value={text ? moment(text) : undefined}
          format={format}
        />
      ),
    },
    {
      title: '窜货经销商',
      dataIndex: 'dealerName',
      width: 200,
    },
    {
      title: '是否盖章',
      dataIndex: 'isStamp',
      width: 200,
      render: (text, record, index) => (
        <Select
          options={enumsBoolean2}
          value={text}
          disabled={disabled}
          onChange={(e) => {
            colChangeValue(e, 'isStamp', index);
          }}
          style={style}
          placeholder='请选择'
        />
      ),
    },
    {
      title: '盖章情况说明',
      dataIndex: 'stampInstructions',
      width: 200,
      render: (text, record, index) => (
        <TextArea
          value={text}
          autoSize
          disabled={disabled}
          onChange={(e) => {
            colChangeValue(e.target.value, 'stampInstructions', index);
          }}
          placeholder='请输入盖章情况说明'
        />
      ),
    },
    {
      title: '渠道类型',
      dataIndex: 'channelCode',
      width: 200,
      render: (text, record, index) => (
        <Select disabled labelInValue value={text ? { label: record.channelName, value: record.channelCode } : undefined} options={productType} style={style} placeholder='请选择' />
      ),
    },
    {
      title: '箱瓶物流码',
      dataIndex: 'logisticNo',
      width: 200,
      render: (text, record, index) => (
        <TextArea
          autoSize
          value={text}
          onChange={(e) => {
            colChangeValue(e.target.value, 'logisticNo', index);
          }}
          disabled={disabled || record.forensiscId || false}
          placeholder='请输入箱瓶物流码'
        />
      ),
    },
    {
      title: '提货日期',
      dataIndex: 'factoryDate',
      width: 200,
      render: (text, record, index) => (
        <DatePicker
          disabled={disabled || record.forensiscId || false}
          onChange={(e) => {
            const value = e ? e.format(format) : null;
            colChangeValue(value, 'factoryDate', index);
          }}
          style={style}
          value={text ? moment(text) : undefined}
          format={format}
        />
      ),
    },
    {
      title: '是否毁坏物流标识',
      dataIndex: 'isBadMarkNum',
      width: 200,
      render: (text, record, index) => (
        <Select
          value={text}
          disabled={disabled}
          onChange={(e) => {
            colChangeValue(e, 'isBadMarkNum', index);
          }}
          options={enumsBoolean2}
          style={style}
          placeholder='请选择'
        />
      ),
    },
    {
      title: '提货数量',
      dataIndex: 'totalBarCode',
      width: 150,
      render: (text, record, index) => (
        <InputNumber
          value={text}
          addonAfter='箱'
          onChange={(e) => {
            colChangeValue(e, 'unit', index);
          }}
          style={style}
          min={0}
          disabled={disabled || record.forensiscId || false}
          placeholder='请输入'
        />
      ),
    },
    {
      title: '批发价格',
      dataIndex: 'wholesalePrice',
      width: 150,
      render: (text, record, index) => (
        <InputNumber
          value={text}
          addonAfter='元'
          disabled={disabled}
          onChange={(e) => {
            colChangeValue(e, 'wholesalePrice', index);
          }}
          style={style}
          min={0}
          placeholder='请输入'
        />
      ),
    },
    {
      title: '购买价格',
      dataIndex: 'singlePrice',
      width: 150,
      render: (text, record, index) => (
        <InputNumber
          addonAfter='元'
          style={style}
          min={0}
          onChange={(e) => {
            colChangeValue(e, 'singlePrice', index);
          }}
          value={text}
          disabled={disabled || record.forensiscId || false}
          placeholder='请输入'
        />
      ),
    },
    {
      title: '当地市场价',
      dataIndex: 'localPrice',
      width: 150,
      render: (text, record, index) => (
        <InputNumber
          value={text}
          addonAfter='元'
          style={style}
          min={0}
          onChange={(e) => {
            colChangeValue(e, 'localPrice', index);
          }}
          disabled={disabled || record.forensiscId || false}
          placeholder='请输入'
        />
      ),
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      width: 150,
      render: (text, record, index) => (
        <InputNumber
          value={text}
          addonAfter='瓶'
          style={style}
          min={0}
          onChange={(e) => {
            colChangeValue(e, 'quantity', index);
          }}
          disabled={disabled || record.forensiscId || false}
          placeholder='请输入'
        />
      ),
    },
    {
      title: '购买时间',
      dataIndex: 'buyTime',
      width: 200,
      render: (text, record, index) => {
        return (
          <DatePicker
            style={style}
            onChange={(e) => {
              const value = e ? e.format(format) : null;
              colChangeValue(value, 'buyTime', index);
            }}
            value={text ? moment(text) : undefined}
            disabled={disabled || record.forensiscId || false}
            format={format}
          />
        );
      },
    },
    {
      title: '备注说明',
      dataIndex: 'remark',
      width: 200,
      render: (text, record, index) => (
        <TextArea
          value={text}
          autoSize
          disabled={disabled}
          onChange={(e) => {
            colChangeValue(e.target.value, 'remark', index);
          }}
          placeholder='请输入备注'
        />
      ),
    },
  ];
  const rowSelection = {
    selectedRowKeys,
    getCheckboxProps: (record) => ({
      disabled: record.forensiscId || disabled,
    }),
    onChange: (keys) => {
      setSelectedRowKeys(keys);
    },
  };
  return (
    <Fragment>
      {!disabled && (
        <Space style={{ marginBottom: '10px' }}>
          <Button onClick={addData} type='primary'>
            新增行
          </Button>
          <Button onClick={delColData} danger type='primary'>
            删除行
          </Button>
        </Space>
      )}
      <Table rowKey='id' size='small' pagination={false} rowSelection={rowSelection} dataSource={dataSource} columns={columns} scroll={{ x: columns.reduce((m, n) => m + n.width, 0), y: 300 }} />
    </Fragment>
  );
  // 行输入
  function colChangeValue(e, field, index) {
    let newDataSource = cloneDeep(dataSource);
    newDataSource[index][field] = e;
    setDataSource(newDataSource);
  }
  // 删除行数据
  function delColData() {
    if (!selectedRowKeys.length) {
      return message.error('请选择至少一行数据');
    }
    Modal.confirm({
      title: '提示',
      icon: <ExclamationCircleOutlined />,
      content: '确定删除已选数据吗？',
      onOk: () => {
        let newDataSource = cloneDeep(dataSource);
        newDataSource = newDataSource.filter((v) => !selectedRowKeys.some((m) => m == v.id));
        setSelectedRowKeys([]);
        setDataSource(newDataSource);
      },
    });
  }
  // 添加行数据
  function addData() {
    let newDataSource = cloneDeep(dataSource);
    newDataSource.push({ id: `${new Date().valueOf()}` });
    setDataSource(newDataSource);
  }
  // 获取经销商数据
  async function getDealerOptions(params, index) {
    const { data } = await getDealerByBoxCodeOrBotCode(params);
    let newDataSource = cloneDeep(dataSource);
    if (!data?.franchiserCode) {
      // 没有条码置空
      if (newDataSource[index].boxProductionDate) {
        newDataSource[index].boxProductionDate = null;
      }
      if (newDataSource[index].botProductionDate) {
        newDataSource[index].botProductionDate = null;
      }
      newDataSource[index].botCode = null;
      newDataSource[index].boxCode = null;
    } else {
      newDataSource[index].dealerCode = data.franchiserCode;
      newDataSource[index].dealerName = data.franchiserName;
      newDataSource[index].terminalProvinceName = data.provinceName;
      newDataSource[index].terminalCityName = data.cityName;
      newDataSource[index].terminalAreaName = data.districtName;
    }
    // return newDataSource;
    setDataSource(newDataSource);
  }
}
export default QueryCodeForm;

function ProductSelect({ disabled, value, onChange }) {
  const [fetching, setFetching] = useState(false);
  const [selectData, setSelectData] = useState([]);
  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      setSelectData([]);
      setFetching(true);
      getData(value);
    };
    return debounce(loadOptions, 500);
  }, []);
  useEffect(() => {
    getData();
  }, []);
  return (
    <Select
      disabled={disabled}
      labelInValue
      value={value}
      showSearch
      onChange={(e) => {
        let item = selectData.find((v) => v.productCode == e.key);
        onChange && onChange(item || {});
      }}
      filterOption={false}
      style={style}
      fieldNames={{ label: 'productName', value: 'productCode' }}
      options={selectData}
      onSearch={debounceFetcher}
      placeholder='请选择产品'
    />
  );
  async function getData(value = '') {
    try {
      setFetching(true);
      let res = await productPage(value);
      setFetching(false);
      setSelectData(res.data.records);
    } catch (err) {
      setFetching(false);
    }
  }
}

function DealerSelect({ branchCode = '', disabled, onChange, value }) {
  const [fetching, setFetching] = useState(false);
  const [selectData, setSelectData] = useState([]);
  useEffect(() => {
    getData();
  }, []);
  return (
    <Select
      labelInValue
      showSearch
      style={style}
      disabled={disabled}
      value={value}
      onChange={(e) => {
        let item = selectData.find((v) => v.franchiserCode == e.key);
        onChange && onChange(item || {});
      }}
      filterOption={(inputValue, option) => option.franchiserName.includes(inputValue)}
      fieldNames={{ label: 'franchiserName', value: 'franchiserCode' }}
      options={selectData}
      placeholder='请选择经销商'
    />
  );
  async function getData() {
    try {
      setFetching(true);
      let res = await findContractDealerPage(branchCode);
      setFetching(false);
      setSelectData(res.data.rows);
    } catch (err) {
      setFetching(false);
    }
  }
}
