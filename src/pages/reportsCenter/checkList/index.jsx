import React, { useRef, Fragment, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { handleProTableRes } from '@/utils/index';
import { Button, message } from 'antd';
import { TABLE_CONFIG } from '@/constants';
import { reportPage, statusEnum } from './service';
import ChangeDelear from './components/changeDelear';
import { openPage } from '@/utils/windowLayout';

const typeEnums = [
  { label: '价格异常', value: 1 },
  { label: '窜货', value: 2 },
];
function CheckList() {
  const proTableRef = useRef();
  const [selectedRow, setSelectedRow] = useState([]);
  const [createVisible, setCreateVisible] = useState(false);
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
    },
    {
      title: '标题',
      dataIndex: 'themeName',
      search: false,
    },
    {
      title: '表单号',
      dataIndex: 'formNum',
    },
    {
      title: '类型',
      dataIndex: 'type',
      valueType: 'select',
      request: () => typeEnums,
    },
    {
      title: '制表日期',
      dataIndex: 'tabulationDate',
      valueType: 'date',
    },
    {
      title: '收货通知单状态',
      dataIndex: 'isCreateName',
      search: false,
    },
    {
      title: '提交状态',
      dataIndex: 'status',
      valueType: 'select',
      fieldProps: { fieldNames: { label: 'typeName', value: 'typeCode' } },
      request: () => statusEnum().then((res) => res.data),
    },
    {
      title: '申请人',
      dataIndex: 'fullName',
      search: false,
    },
  ];
  const rowSelection = {
    type: 'radio',
    selectedRowKeys: selectedRow.map((v) => v.id),
    onChange: (keys, rows) => {
      setSelectedRow(rows);
    },
  };
  return (
    <Fragment>
      <ProTable
        headerTitle='窜货核查报告列表'
        search={{ labelWidth: 'auto' }}
        columns={columns}
        actionRef={proTableRef}
        rowSelection={rowSelection}
        toolBarRender={() => [
          <Button onClick={createReport} type='primary'>
            创建收货通知单
          </Button>,
          <Button
            onClick={() => {
              editRecord('edit');
            }}
            type='primary'
          >
            编辑
          </Button>,
          <Button
            onClick={() => {
              editRecord('view');
            }}
            type='primary'
          >
            查看
          </Button>,
        ]}
        {...TABLE_CONFIG}
        request={async (params) => reportPage(params).then((res) => handleProTableRes(res))}
      />
      <ChangeDelear rowId={selectedRow[0]?.id} visible={createVisible} onOk={onOk} onCancel={setCreateVisible.bind(this, false)} />
    </Fragment>
  );
  //
  function onOk(e) {
    setCreateVisible(false);
    openPage({
      pathname: `/processForm/noticeBill/${new Date().valueOf()}`,
      state: e[0],
      name: '创建收货单',
    });
  }
  function editRecord(type) {
    if (!selectedRow.length) {
      message.error('请至少选择一行数据！');
      return;
    }
    openPage({
      pathname: `/processForm/feelForm/${selectedRow[0].id}`,
      state: {
        type: selectedRow[0].type,
        pageType: type,
        id: selectedRow[0].id,
      },
      name: `${type == 'edit' ? '编辑' : '查看'}核查报告单`,
    });
  }
  function createReport() {
    if (!selectedRow.length) {
      message.error('请至少选择一行数据！');
      return;
    }
    setCreateVisible(true);
  }
}

export default CheckList;
