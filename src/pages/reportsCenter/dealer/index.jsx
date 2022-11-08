import React, { Fragment, useRef, useState, useEffect } from 'react';
import { Button, Modal, Table, Row, Col, Space, message, Select, InputNumber, DatePicker, Upload } from 'antd';
import { findByDealer, downloadExcelTemplate, dealerStockProduct, getDealerStockReportPage, saveReport } from './service';
import { ProTable } from '@ant-design/pro-components';
import { handleProTableRes, handleRes, downLoadFile, Container } from '@/utils/index';
import { uniqueId, cloneDeep, debounce } from 'lodash';
import { useModel } from '@@/plugin-model';
import { TABLE_CONFIG } from '@/constants';
import moment from 'moment';
const debounceFun = debounce((func, e) => {
  func(e);
}, 500);

function Dealer() {
  const {
    initialState: { username },
  } = useModel('@@initialState');
  const proTableRef = useRef();
  const [dataSource, setDataSource] = useState([]);
  const [temBtnLoading, setTemBtnLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [branchArray, setBranchArray] = useState([]);
  const [fileList, setFileList] = useState([]);
  const columns = [
    { title: '序号', dataIndex: 'index', valueType: 'index', width: 48 },
    { title: '经销商编码', dataIndex: 'dealerCode' },
    { title: '经销商名称', dataIndex: 'dealerName' },
    { title: '产品编码', dataIndex: 'productCode' },
    { title: '产品名称', dataIndex: 'productName' },
    { title: '分办名称', dataIndex: 'branchName', search: false },
    { title: '大区名称', dataIndex: 'regionName', search: false },
    { title: '库存金额（万元）', dataIndex: 'stockAmount', search: false },
    { title: '库存数量', dataIndex: 'stockNum', search: false },
    { title: '截至日期', dataIndex: 'endDate', search: false },
    {
      title: '提报日期',
      dataIndex: 'createDate',
      valueType: 'date',
      render: (text, record) => <span>{record.createDate}</span>,
    },
    { title: '填报人', dataIndex: 'createName', search: false },
  ];
  const formColumns = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 60,
      render: (text, record, index) => <span>{index + 1}</span>,
    },
    {
      title: '分办',
      dataIndex: 'branchCode',
      render: (text, record, index) => (
        <Select
          style={{ width: '100%' }}
          options={branchArray}
          showSearch
          onChange={(e) => {
            selectChange(e, index, 'branch');
          }}
          value={
            text
              ? {
                  label: record.branchName,
                  value: record.branchCode,
                  key: record.branchCode,
                }
              : undefined
          }
          labelInValue
          filterOption={(inputValue, option) => option.orgName.includes(inputValue)}
          fieldNames={{ label: 'orgName', value: 'orgCode' }}
          placeholder='请选择分办'
        />
      ),
    },
    {
      title: '产品',
      dataIndex: 'productCode',
      render: (text, record, index) => (
        <ProductSelect
          dataSource={dataSource}
          value={
            text
              ? {
                  label: record.productName,
                  value: record.productCode,
                  key: record.productCode,
                }
              : undefined
          }
          onChange={(e) => {
            selectChange(e, index, 'product');
          }}
        />
      ),
    },
    {
      title: '库存量',
      dataIndex: 'stockNum',
      render: (text, record, index) => (
        <InputNumber
          min={0}
          value={text}
          style={{ width: '100%' }}
          onChange={(e) => {
            rowChange(e, index, 'stockNum');
          }}
          placeholder='请输入库存量'
        />
      ),
    },
    {
      title: '库存金额（万元）',
      dataIndex: 'stockAmount',
      render: (text, record, index) => (
        <InputNumber
          min={0}
          value={text}
          style={{ width: '100%' }}
          onChange={(e) => {
            rowChange(e, index, 'stockAmount');
          }}
          placeholder='请输入库存金额'
        />
      ),
    },
    {
      title: '截止日期',
      dataIndex: 'endDate',
      render: (text, record, index) => (
        <DatePicker
          disabledDate={(e) => e && e < moment().subtract(1, 'day')}
          style={{ width: '100%' }}
          value={text ? moment(text) : undefined}
          onChange={(e) => {
            rowChange(e, index, 'endDate');
          }}
          placeholder='请选择截止日期'
        />
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (rowskey) => {
      setSelectedRowKeys(rowskey);
    },
  };
  useEffect(() => {
    getBranchArray();
  }, []);
  return (
    <Fragment>
      <ProTable
        actionRef={proTableRef}
        headerTitle='经销商提报'
        toolBarRender={() => [
          <Button loading={temBtnLoading} onClick={templateDownload} type='primary'>
            模板下载
          </Button>,
          <Upload
            name='file'
            accept={'.xlsx'}
            fileList={fileList}
            onChange={handleChange}
            headers={{ Authorization: `Bearer ${localStorage.getItem('access_token')}` }}
            action={`/api/oims/dealerReportStock/saveByExcel`}
          >
            <Button type='primary'>批量导入</Button>
          </Upload>,
          <Button onClick={setModalVisible.bind(this, true)} type='primary'>
            新增提报
          </Button>,
        ]}
        request={async (params) => getDealerStockReportPage(params).then((res) => handleProTableRes(res))}
        search={{ labelWidth: 'auto' }}
        {...TABLE_CONFIG}
        columns={columns}
      />
      <Modal width={1200} title='新增经销商提报' onCancel={onCloseModal} getContainer={Container} confirmLoading={loading} onOk={onSaveFun} destroyOnClose visible={modalVisible}>
        <Row>
          <Col span={24}>
            <Space>
              <Button onClick={addRow} type='primary'>
                添加行
              </Button>
              <Button onClick={deleteRow} danger type='primary'>
                删除行
              </Button>
            </Space>
          </Col>
          <Col span={24}>
            <Table size='small' dataSource={dataSource} columns={formColumns} scroll={{ y: 500 }} rowKey='key' pagination={false} rowSelection={rowSelection} />
          </Col>
        </Row>
      </Modal>
    </Fragment>
  );
  function handleChange(info) {
    setFileList(info.fileList);
    if (['done', 'removed'].some((item) => item == info.file.status)) {
      const { response } = info.file;
      setFileList([]);
      if (response.code == '00000') {
        handleRes(response, proTableRef);
      } else {
        message.error(response.message || '导入失败');
      }
    }
  }
  function rowChange(e, index, filed) {
    let newData = cloneDeep(dataSource);
    if (filed == 'endDate') {
      newData[index][filed] = e ? e.format('YYYY-MM-DD') : undefined;
    } else {
      newData[index][filed] = e;
    }
    setDataSource(newData);
  }
  function selectChange(e, index, filed) {
    let newData = cloneDeep(dataSource);
    newData[index][`${filed}Name`] = e.label;
    newData[index][`${filed}Code`] = e.value;
    setDataSource(newData);
  }
  // 请求经销商分办
  async function getBranchArray() {
    try {
      let res = await findByDealer(username);
      setBranchArray(res.data || []);
    } catch (err) {}
  }
  // 关闭弹窗
  function onCloseModal() {
    setModalVisible(false);
    setSelectedRowKeys([]);
    setDataSource([]);
  }
  // 点击确定
  async function onSaveFun() {
    if (!dataSource.length) {
      message.error('请添加至少一行数据!');
      return;
    }
    let errIndex = -1,
      messageT;
    for (let i = 0; i < dataSource.length; i++) {
      if (!dataSource[i].branchCode) {
        messageT = '分办';
        errIndex = i;
        break;
      }
      if (!dataSource[i].productCode) {
        messageT = '产品';
        errIndex = i;
        break;
      }
      if (!dataSource[i].stockNum) {
        messageT = '库存量';
        errIndex = i;
        break;
      }
      if (!dataSource[i].stockAmount) {
        messageT = '库存金额';
        errIndex = i;
        break;
      }
      if (!dataSource[i].endDate) {
        messageT = '截止日期';
        errIndex = i;
        break;
      }
    }
    if (errIndex != -1) {
      message.error(`第${errIndex + 1}行“${messageT}”不能为空！`);
      return;
    }
    try {
      setLoading(true);
      let res = await saveReport(dataSource);
      setLoading(false);
      if (res.code == '00000') {
        onCloseModal();
        handleRes(res, proTableRef);
      }
    } catch (err) {
      setLoading(false);
    }
  }
  // 下载模板
  async function templateDownload() {
    try {
      setTemBtnLoading(true);
      let res = await downloadExcelTemplate();
      downLoadFile(res, '经销商提报导入模板');
    } catch (err) {
    } finally {
      setTemBtnLoading(false);
    }
  }
  // 添加行数据
  function addRow() {
    let newData = cloneDeep(dataSource);
    let params = {
      key: uniqueId('PRODUCT_'),
      productCode: undefined,
      productName: undefined,
      branchCode: undefined,
      branchName: undefined,
      stockAmount: undefined,
      stockNum: undefined,
      endDate: undefined,
    };
    newData.push(params);
    setDataSource(newData);
  }
  // 删除行数据
  function deleteRow() {
    if (!selectedRowKeys.length) return;
    let newData = dataSource.filter((v) => !selectedRowKeys.some((m) => m === v.key));
    setSelectedRowKeys([]);
    setDataSource(newData);
  }
}
export default Dealer;

function ProductSelect({ onChange, value, dataSource }) {
  const [productList, setProductList] = useState([]);
  useEffect(() => {
    getProduct();
  }, []);
  return (
    <Select
      style={{ width: '100%' }}
      options={productList}
      showSearch
      labelInValue
      onChange={onChange}
      value={value}
      filterOption={false}
      onSearch={(e) => {
        debounceFun(getProduct, e);
      }}
      fieldNames={{ label: 'productName', value: 'productCode' }}
      placeholder='请选择产品'
    />
  );
  async function getProduct(productName = '') {
    try {
      let { data } = await dealerStockProduct({
        current: 1,
        size: 1000,
        productName,
      });
      setProductList(data.records);
    } catch (err) {}
  }
}
