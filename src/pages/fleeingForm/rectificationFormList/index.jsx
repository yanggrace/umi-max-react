/*
 * @Author: wangrui
 * @Date: 2022-08-26 09:49:35
 * @LastEditors: wangrui
 * @Description:整改验收单列表
 * @LastEditTime: 2022-09-23 11:27:25
 */
import { useRef, useState } from 'react';
import { handleProTableRes, handleRes } from '@/utils/index';
import { ProTable } from '@ant-design/pro-components';
import { Button, Upload, message } from 'antd';
import { getRectifyPage } from './service';
import { history } from '@umijs/max';
import { openPage } from '@/utils/windowLayout';
import { TABLE_CONFIG } from '@/constants';
console.log(history);
const columns = [
  { title: '序号', dataIndex: 'index', valueType: 'index', width: 48, hideInSearch: true },
  { title: '标题', dataIndex: 'titleName', hideInSearch: true },
  { title: '表单号', dataIndex: 'formNum' },
  {
    title: '类型',
    valueType: 'select',
    valueEnum: {
      1: '价格异常',
      2: '窜货',
    },
    dataIndex: 'type',
    render: (text, record) => <span>{record.typeName}</span>,
  },
  { title: '制表日期', dataIndex: 'createDate', valueType: 'date' },
  {
    title: '提交状态',
    dataIndex: 'submitStatusName',
    hideInSearch: true,
  },
  { title: '提交人', dataIndex: 'createName', hideInSearch: true },
];
function rectificationFormList() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选择的值id
  const [selectedRows, setSelectedRows] = useState([]); // 选择的值id

  const proTableRef = useRef();
  const rowSelection = {
    selectedRowKeys,
    onChange: (rowskey, selectedRows) => {
      console.log('rowskey', rowskey);
      setSelectedRowKeys(rowskey);
      setSelectedRows(selectedRows);
    },
  };
  return (
    <>
      <ProTable
        {...TABLE_CONFIG}
        actionRef={proTableRef}
        rowSelection={rowSelection}
        columns={columns}
        options={{ fullScreen: false, reload: false, setting: true }}
        headerTitle='整改验收单列表'
        request={(params) => getRectifyPage(params).then((res) => handleProTableRes(res))}
        toolBarRender={() => [
          <Button
            type='primary'
            onClick={() => {
              if (selectedRowKeys.length !== 1) {
                message.warn('请选择一行数据');
                return;
              }
              openPage({
                pathname: `/fleeingForm/rectificationForm/${selectedRowKeys[0]}`,
                state: {
                  isCheck: true,
                  ...selectedRows[0],
                },
                name: '整改验收单详情',
              });
            }}
          >
            查看
          </Button>,
          <Button
            type='primary'
            onClick={() => {
              if (selectedRowKeys.length !== 1) {
                message.warn('请选择一行数据');
                return;
              }
              // history.push(`/fleeingForm/rectificationForm?id=${selectedRowKeys[0]}`, {
              //   isEdit: true,
              //   dataSource: selectedRows[0],
              // });
              openPage({
                pathname: `/fleeingForm/rectificationForm/${selectedRowKeys[0]}`,
                state: {
                  isEdit: true,
                  ...selectedRows[0],
                },
                name: '编辑整改验收单',
              });
            }}
          >
            编辑
          </Button>,
        ]}
      ></ProTable>
    </>
  );
}

export default rectificationFormList;
