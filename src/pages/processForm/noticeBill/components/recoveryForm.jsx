import React, { forwardRef, useImperativeHandle, useState, useRef, useEffect } from 'react';
import { EditableProTable, date } from '@ant-design/pro-components';
import { enumsBoolean, productType, channelEnums } from '../../config';
import { Form, Popconfirm } from 'antd';
import { getProductList, channelTypeList } from '../service';

function RecoveryForm({ initialData = [], disabled }, ref) {
  const [editableKeys, setEditableRowKeys] = useState();
  const tableRef = useRef();
  const [useForm] = Form.useForm();
  const [dataSource, setDataSource] = useState();
  //   useEffect(() => {});
  useImperativeHandle(ref, () => ({
    dataSource,
    useForm,
  }));
  useEffect(() => {
    if (initialData.length) {
      setDataSource(initialData.map((item) => ({ ...item, channelName: { label: item.channelName, value: item.channelCode }, productName: { label: item.productName, value: item.productCode } })));
      setEditableRowKeys(initialData.map((item) => item.id));
    }
    if (disabled) {
      setEditableRowKeys([]);
    }
  }, [initialData, disabled]);

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
      fixed: 'left',
    },
    {
      title: '签单日期',
      dataIndex: 'dateOfSigning',
      width: 150,
      valueType: 'date',
      fieldProps: {
        style: { width: '100%' },
        format: 'YYYY-MM-DD',
        // onChange: (data, dateString) => {
        //   console.log(data, dateString);
        //   console.log(useForm);
        //   console.log('1');
        //   useForm.setFieldValue({
        //     dateOfSigning: dateString,
        //   });
        // },
      },
    },
    {
      title: '取证渠道',
      dataIndex: 'channelName',
      valueType: 'select',
      width: 150,
      request: () => channelTypeList().then((res) => handleChaneldatabase(res)),
      formItemProps: () => ({ rules: [{ required: true, message: '此项为必填项' }] }),
      //   editable: (text, record, index) => {
      //     return index < initialData.length;
      //   },
      fieldProps: {
        labelInValue: true,
        fieldNames: { label: 'channelName', value: 'channelCode' },
      },
    },
    {
      title: '产品',
      dataIndex: 'productName',
      valueType: 'select',
      params: { current: 1, size: 10000 },
      width: 150,
      request: (params) => getProductList(params).then((res) => res.data.records),
      formItemProps: () => ({ rules: [{ required: true, message: '此项为必填项' }] }),
      fieldProps: {
        labelInValue: true,
        fieldNames: { label: 'productName', value: 'productCode' },
      },
    },
    {
      title: '取证数量',
      tooltip: '瓶',
      dataIndex: 'quantity',
      valueType: 'digit',
      width: 150,
      fieldProps: {
        precision: 0,
        style: { width: '100%' },
      },
    },
    {
      title: '购买价格',
      dataIndex: 'singlePrice',
      tooltip: '元/瓶',
      width: 150,
      valueType: 'money',
      fieldProps: {
        style: { width: '100%' },
      },
    },
    {
      title: '当地市场价',
      dataIndex: 'localPrice',
      width: 150,
      valueType: 'money',
      fieldProps: {
        style: { width: '100%' },
      },
    },
    {
      title: '提货日期',
      dataIndex: 'factoryDate',
      width: 150,
      valueType: 'date',
      fieldProps: {
        style: { width: '100%' },
      },
    },
    {
      title: '规格',
      dataIndex: 'unit',
      width: 150,
      valueType: 'digit',
      fieldProps: {
        precision: 0,
        style: { width: '100%' },
      },
    },
    {
      title: '是否毁坏物流标识',
      dataIndex: 'isBadMarkNum',
      width: 150,
      valueType: 'select',
      fieldProps: {
        style: { width: '100%' },
      },
      request: () => [
        { label: '是', value: true },
        { label: '否', value: false },
      ],
    },
    {
      title: '操作',
      fixed: 'right',
      width: 100,
      valueType: 'option',
    },
  ];
  const recordCreatorProps = {
    position: 'bottom',
    creatorButtonText: '新增行',
    newRecordType: 'dataSource',
    record: () => ({ id: Date.now() }),
    style: {
      display: disabled ? 'none' : '',
    },
  };
  const editable = {
    type: 'multiple',
    editableKeys,
    form: useForm,
    onChange: setEditableRowKeys,
    actionRender: (row, config, dom) => [dom.delete],
    onValuesChange: (record, recordList, a) => {
      console.log(record, recordList, a);
      setDataSource(recordList);
    },
  };
  return (
    <EditableProTable
      rowKey='id'
      value={dataSource}
      editable={editable}
      onChange={setDataSource}
      actionRef={tableRef}
      columns={columns}
      tableAlertRender={false}
      scroll={{ x: columns.reduce((m, n) => m + n.width, 0), y: 300 }}
      recordCreatorProps={recordCreatorProps}
    />
  );
  function handleChaneldatabase({ data = [] }) {
    return Object.keys(data).map((key) => ({
      channelCode: key,
      channelName: data[key],
    }));
  }
}

export default forwardRef(RecoveryForm);
