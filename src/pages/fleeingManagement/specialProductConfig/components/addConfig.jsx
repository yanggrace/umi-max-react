/*
 * @Author: wangrui
 * @Date: 2022-08-22 08:53:16
 * @LastEditors: wangrui
 * @Description:
 * @LastEditTime: 2022-09-15 14:46:23
 */
import { Table, Modal, Button, Input, message, Select } from 'antd';
import { useState, useEffect } from 'react';
import { getCategoryList, getNextList, getProductList, saveSpecialConfig, getSpecialConfig, editSpecialConfig } from './../service';
import { uniqueId, cloneDeep, debounce } from 'lodash';
const debounceFun = debounce((func, e, index, dataSource) => {
  func(e, index, dataSource);
}, 500);
const { Option } = Select;
const AddConfig = ({ params, setEditParams }) => {
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([{ id: uniqueId() }]); // 列表数据

  const [categoryOption, setCategoryOption] = useState([]); // 品类下拉框
  const [brandOption, setBranchOption] = useState([]); // 品牌的下拉框 二维数组
  const [seriesOption, setSeriesOption] = useState([]); // 系列的下拉框
  const [bigLevelOption, setBigLevelOption] = useState([]); // 大类下拉框
  const [smallLevelOption, setSmallLevelOption] = useState([]); // 小类下拉框
  const [productOption, setProductOption] = useState([]); // 产品下拉框

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    selectedRowKeys,
  };
  useEffect(() => {
    getCategoryOption();
  }, []);
  useEffect(() => {
    if (!params.id) return;
    getDetail(params.id);
  }, [params.id]);
  const add_config_columns = [
    {
      title: '行号',
      align: 'center',
      dataIndex: 'index',
      width: '80px',
      render: (text, record, index) => index + 1,
    },
    {
      title: '品类',
      dataIndex: 'categoryCode',
      render: (text, record, index) => {
        return (
          <Select
            labelInValue
            options={categoryOption}
            value={
              text
                ? {
                    label: record.categoryName,
                    value: record.categoryCode,
                    key: record.categoryCode,
                  }
                : undefined
            }
            style={{ width: '100%' }}
            fieldNames={{ label: 'levelName', value: 'levelCode' }}
            onChange={(v) => {
              selectChange(v, index, 'category', { brandCode: undefined, seriesCode: undefined, bigLevelCode: undefined, smallLevelCode: undefined, productCode: undefined });
              setSeriesOption([]);
              setBigLevelOption([]);
              setSmallLevelOption([]);
              setProductOption([]);
              getNextOption(v, setBranchOption, brandOption, index);
            }}
            allowClear
            placeholder='请选择'
          ></Select>
        );
      },
    },
    {
      title: '品牌',
      dataIndex: 'brandCode',
      render: (text, record, index) => {
        return (
          <Select
            options={brandOption[index]}
            labelInValue
            value={
              text
                ? {
                    label: record.brandName,
                    value: record.brandCode,
                    key: record.brandCode,
                  }
                : undefined
            }
            style={{ width: '100%' }}
            onChange={(v) => {
              selectChange(v, index, 'brand', { seriesCode: undefined, bigLevelCode: undefined, smallLevelCode: undefined, productCode: undefined });
              setBigLevelOption([]);
              setSmallLevelOption([]);
              getNextOption(v, setSeriesOption, seriesOption, index);
            }}
            fieldNames={{ label: 'levelName', value: 'levelCode' }}
            allowClear
            placeholder='请选择'
          ></Select>
        );
      },
    },
    {
      title: '系列',
      dataIndex: 'seriesCode',
      render: (text, record, index) => {
        return (
          <Select
            options={seriesOption[index]}
            labelInValue
            value={
              text
                ? {
                    label: record.seriesName,
                    value: record.seriesCode,
                    key: record.seriesCode,
                  }
                : undefined
            }
            style={{ width: '100%' }}
            onChange={(v) => {
              selectChange(v, index, 'series', { bigLevelCode: undefined, smallLevelCode: undefined, productCode: undefined });
              setSmallLevelOption([]);
              getNextOption(v, setBigLevelOption, bigLevelOption, index);
            }}
            fieldNames={{ label: 'levelName', value: 'levelCode' }}
            allowClear
            placeholder='请选择'
          />
        );
      },
    },
    {
      title: '大类',
      dataIndex: 'bigLevelCode',
      render: (text, record, index) => {
        return (
          <Select
            options={bigLevelOption[index]}
            labelInValue
            style={{ width: '100%' }}
            value={
              text
                ? {
                    label: record.bigLevelName,
                    value: record.bigLevelCode,
                    key: record.bigLevelCode,
                  }
                : undefined
            }
            onChange={(v) => {
              selectChange(v, index, 'bigLevel', { smallLevelCode: undefined, productCode: undefined });
              getNextOption(v, setSmallLevelOption, smallLevelOption, index);
            }}
            fieldNames={{ label: 'levelName', value: 'levelCode' }}
            allowClear
            placeholder='请选择'
          />
        );
      },
    },
    {
      title: '细类',
      dataIndex: 'smallLevelCode',
      render: (text, record, index) => {
        return (
          <Select
            options={smallLevelOption[index]}
            labelInValue
            style={{ width: '100%' }}
            value={
              text
                ? {
                    label: record.smallLevelName,
                    value: record.smallLevelCode,
                    key: record.smallLevelCode,
                  }
                : undefined
            }
            fieldNames={{ label: 'levelName', value: 'levelCode' }}
            onChange={(v) => {
              selectChange(v, index, 'smallLevel', { productCode: undefined });
            }}
            allowClear
            placeholder='请选择'
          />
        );
      },
    },
    {
      title: '产品名称',
      dataIndex: 'productCode',
      placeholder: '请选择',
      render: (text, record, index) => {
        return (
          <Select
            value={
              text
                ? {
                    label: record.productName,
                    value: record.productCode,
                    key: record.productCode,
                  }
                : undefined
            }
            style={{ width: '100%' }}
            onChange={(v) => selectChange(v, index, 'product')}
            showSearch
            allowClear
            labelInValue
            onSearch={(e) => {
              debounceFun(getProduct, e, index, dataSource);
            }}
            placeholder='请选择'
          >
            {productOption.length ? productOption[index]?.map((d, i) => <Option key={d.productCode}>{d.productName}</Option>) : []}
          </Select>
        );
      },
    },
  ];
  // 删除行
  const deleteLine = (type = 'person') => {
    if (selectedRowKeys.length !== 1) {
      message.error('请选择一项进行删除');
      return;
    }
    setDataSource(dataSource.filter((item) => item.id !== selectedRowKeys[0]));
    setSelectedRowKeys([]);
  };
  // 添加行
  const addLine = () => {
    setDataSource([...dataSource, { id: new Date().getTime(), invalid: false }]);
  };
  return (
    <Modal
      title={params.type == 1 ? '新增' : '编辑'}
      visible={params.visible}
      onCancel={() => {
        setEditParams.bind(this, {
          id: '',
          visible: false,
        })();
        setDataSource([{ id: uniqueId() }]);
        setBranchOption([]);
      }}
      confirmLoading={confirmLoading}
      onOk={handleSubmit}
      width='80vw'
    >
      {/* <div style={{ margin: '20px 0 10px' }}>
        {params.type === 1 ? (
          <>
            <Button style={{ margin: '0 20px 0' }} onClick={() => addLine()} type='primary'>
              添加行
            </Button>
            <Button type='primary' onClick={() => deleteLine()}>
              删除行
            </Button>
          </>
        ) : (
          ''
        )}
      </div> */}

      <Table
        size='small'
        pagination={false}
        columns={add_config_columns}
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        dataSource={dataSource}
        rowKey={(record) => record.id}
        scroll={{ x: 'max-content' }}
        bodyStyle={{
          padding: 0,
          background: '#f0f2f5',
        }}
      />
    </Modal>
  );

  // select修改
  async function selectChange(v, index, filed, params) {
    const { label, value } = v || {};
    let newData = cloneDeep(dataSource);
    newData[index] = {
      ...newData[index],
      [`${filed}Name`]: label,
      [`${filed}Code`]: value,
      ...params,
    };
    setDataSource(newData);
    if (filed == 'series' || filed == 'bigLevel' || filed == 'smallLevel') {
      getProduct('', index, newData);
    }
  }
  // 获取品类的下拉菜单
  async function getCategoryOption() {
    let { data } = await getCategoryList();
    setCategoryOption(data || []);
  }
  // 获取下一级的下拉框
  async function getNextOption(v, setFun, fnData, index) {
    const { value } = v || {};
    let { data } = await getNextList(value);
    let newData = cloneDeep(fnData);

    newData[index] = data;
    console.log(newData, index, newData.length);
    setFun(newData);
  }
  // 获取产品list
  async function getProduct(productCodeOrName = '', index, dataSource) {
    const { bigLevelCode, brandCode, categoryCode, seriesCode, smallLevelCode } = dataSource[index];
    if (!seriesCode) return;
    let { data } = await getProductList({
      current: 1,
      size: 10,
      bigLevelCode,
      brandCode,
      categoryCode,
      productCodeOrName,
      seriesCode: seriesCode || defaultValue,
      smallLevelCode,
    });

    let newData = cloneDeep(productOption);
    newData[index] = data.records;
    setProductOption(newData);
    console.log(productOption);
  }
  // 提交
  async function handleSubmit() {
    const data = {
      ...dataSource[0],
    };
    if (!checkParams(data)) return;
    setConfirmLoading(true);
    //  新增
    let res;
    if (params.type == 1) {
      delete data.id;
      res = await saveSpecialConfig(data);
    } else {
      res = await editSpecialConfig(data);
    }
    setConfirmLoading(false);
    if (res?.code !== '00000') return;
    message.success('操作成功');
    params.tableRef?.current?.reload();
    setEditParams.bind(this, {
      id: '',
      visible: false,
    })();
    setDataSource([{ id: uniqueId() }]);
    setBranchOption([]);
  }
  //查详情
  async function getDetail(id) {
    const { data } = await getSpecialConfig(id);
    console.log(data, '-------');
    [{ ...data }].map((item, index) => {
      getNextOption({ value: item.categoryCode }, setBranchOption, brandOption, index);
      getNextOption({ value: item.brandCode }, setSeriesOption, seriesOption, index);
      getNextOption({ value: item.seriesCode }, setBigLevelOption, bigLevelOption, index);
      item.bigLevelCode && getNextOption({ value: item.bigLevelCode }, setSmallLevelOption, smallLevelOption, index);
      item.smallLevelCode && getNextOption({ value: item.smallLevelCode }, setSmallLevelOption, smallLevelOption, index);
      getProduct('', index, [{ ...data }]);
    });
    setDataSource([{ ...data }]);
  }
  // 校验参数
  function checkParams(data) {
    const { categoryCode, seriesCode, brandCode, productCode } = data;
    if (!categoryCode) {
      message.warn('请选择品类');
      return false;
    }
    if (!brandCode) {
      message.warn('请选择品牌');
      return false;
    }
    if (!seriesCode) {
      message.warn('请选择系列');
      return false;
    }
    if (!productCode) {
      message.warn('请选择产品');
      return false;
    }
    return true;
  }
};
export default AddConfig;
