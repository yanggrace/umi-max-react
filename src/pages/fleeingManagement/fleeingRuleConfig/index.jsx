/*
 * @Author: wangrui
 * @Date: 2022-08-22 10:22:17
 * @LastEditors: wangrui
 * @Description:窜货规则配置
 * @LastEditTime: 2022-08-31 15:25:06
 */
import { Fragment, useRef, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { Button, Upload, message, Popconfirm } from 'antd';
import { handleProTableRes, handleRes } from '@/utils/index';
import { getProvince, getCity, getFleeingPage, deleteFleeingPage } from './serveice';
import RuleConfig from './components/ruleConfig';
function fleeingRuleConfig() {
  const proTableRef = useRef();
  const actionRef = useRef();
  const [fileList, setFileList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选择的值id
  const [selectedRow, setSelectedRow] = useState([]); // 选择的值record
  const [configParams, setConfigParams] = useState({
    data: {},
    visible: false,
    type: 1, // 1 新增 2 编辑
  });
  const [provinceCode, setProvinceCode] = useState('');
  const columns = [
    { title: '序号', dataIndex: 'index', align: 'center', valueType: 'index', width: 48 },
    {
      title: '省',
      dataIndex: 'provinceCode',
      align: 'center',
      valueType: 'select',
      request: (params) => getProvince(params).then((res) => handeSelectDate(res)),
      fieldProps: {
        showSearch: true,
        onChange: (e) => {
          proTableRef.current.setFieldsValue({ cityCode: undefined });
          setProvinceCode(e);
        },
      },
    },
    { title: '市', align: 'center', dataIndex: 'cityName', valueType: 'select', params: { provinceCode }, request: (params) => getCity(params).then((res) => handeSelectDate(res)) },
    {
      title: '取证数量',
      dataIndex: 'la2b2els',
      align: 'center',
      hideInSearch: true,
      renderText: (value, row, index) => {
        const { boxMax, boxMin } = row || {};
        return `起始值：${boxMin};结束值：${boxMax}`;
      },
    },
    { title: '创建人', dataIndex: 'createName', align: 'center' },
    { title: '创建时间', dataIndex: 'createDate', hideInSearch: true, align: 'center' },
    { title: '最近修改人', dataIndex: 'modifyName', hideInSearch: true, align: 'center' },
    { title: '最近修改时间', dataIndex: 'modifyDate', align: 'center' },
  ];
  const rowSelection = {
    selectedRowKeys,
    onChange: (rowskey, selectedRows) => {
      console.log('rowskey', rowskey);
      setSelectedRowKeys(rowskey);
      setSelectedRow(selectedRows);
    },
  };

  return (
    <Fragment>
      <ProTable
        rowSelection={rowSelection}
        formRef={proTableRef}
        actionRef={actionRef}
        columns={columns}
        rowKey='id'
        headerTitle='窜货规则配置'
        options={{ fullScreen: false, reload: false, setting: true }}
        request={(params) => getFleeingPage(params).then((res) => handleProTableRes(res))}
        toolBarRender={() => [
          <Button
            type='primary'
            onClick={() => {
              setConfigParams({
                visible: true,
                type: 1,
                tableRef: actionRef,
              });
            }}
          >
            新增
          </Button>,
          <Button
            type='primary'
            onClick={() => {
              if (selectedRowKeys.length !== 1) {
                message.warn('请选择一行数据');
                return;
              }
              setConfigParams({
                visible: true,
                type: 2,
                tableRef: actionRef,
                id: selectedRowKeys[0],
              });
            }}
          >
            编辑
          </Button>,
          <Popconfirm title='确定删除' onConfirm={handleDelete} okText='确认' cancelText='取消'>
            <Button danger type='primary'>
              删除
            </Button>
          </Popconfirm>,
        ]}
      ></ProTable>
      <RuleConfig params={configParams} setEditParams={setConfigParams}></RuleConfig>
    </Fragment>
  );

  // 删除
  async function handleDelete() {
    if (selectedRowKeys.length < 1) {
      message.warn('请至少选择一行数据');
      return;
    }
    const res = await deleteFleeingPage(selectedRowKeys);
    handleRes(res, actionRef);
  }
  // 处理下拉数据
  function handeSelectDate({ data }) {
    console.log(data, '----');
    return data.map((item) => ({
      label: item.name,
      value: item.code,
    }));
  }
}
export default fleeingRuleConfig;
