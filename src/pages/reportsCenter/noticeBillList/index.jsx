import React, { useRef, Fragment, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { handleProTableRes, downLoadFile } from '@/utils/index';
import { Button, message } from 'antd';
import { fleeingReceivingFormControllerList, channelTypeList, seriousEnum, exportExcels, getFleeingReceiving } from './service';
import { openPage } from '@/utils/windowLayout';
import { TABLE_CONFIG } from '@/constants';

const typeEnums = [
  { label: '窜货', value: '1' },
  { label: '价格异常', value: '2' },
];
const statusEnums = [
  { label: '未创建', value: '1' },
  { label: '已创建', value: '2' },
  { label: '部分创建', value: '3' },
];
const status1Enums = [
  { label: '未提交', value: '1' },
  { label: '已提交', value: '2' },
];
export const enumsBoolean = [
  { label: '是', value: 1 },
  { label: '否', value: 0 },
];
function NoticeBillList() {
  const proTableRef = useRef();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [exportLoading, setExportLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]); // 选择的值id
  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
    },
    {
      title: '标题',
      dataIndex: 'fleeingReceivingName',
      search: false,
    },
    {
      title: '表单号',
      dataIndex: 'fleeingReceivingCode',
    },
    {
      title: '类型',
      dataIndex: 'typeName',
      valueType: 'select',

      request: () => channelTypeList().then((res) => handleChaneldatabase(res)),
    },
    {
      title: '制表日期',
      dataIndex: 'createDate',
      search: false,
    },
    {
      title: '制表日期',
      dataIndex: 'startTime',
      valueType: 'dateRange',
      hideInTable: true,
    },
    {
      title: '经销商',
      dataIndex: 'chooseDealerName',
    },
    {
      title: '是否严重窜货',
      dataIndex: 'serious',
      valueType: 'select',
      request: () => seriousEnum().then((res) => res.data.map((item) => ({ label: item.desc, value: item.type }))),
    },
    {
      title: '创建整改单状态',
      dataIndex: 'rectificationName',
      valueType: 'date',
      valueType: 'select',
      search: false,
    },
    {
      title: '提交状态',
      dataIndex: 'statusName',
      valueType: 'date',
      valueType: 'select',
      search: false,
      request: () => status1Enums,
    },
    {
      title: '创建经销商处罚单状态',
      dataIndex: 'punishName',
      valueType: 'date',
      valueType: 'select',
      search: false,
      request: () => statusEnums,
    },
    {
      title: '提报人',
      dataIndex: 'createName',
      search: false,
    },
  ];
  const rowSelection = {
    type: 'radio',
    selectedRowKeys,
    onChange: (keys, rows) => {
      setSelectedRowKeys(keys);
      setSelectedRows(rows);
    },
  };
  return (
    <Fragment>
      <ProTable
        {...TABLE_CONFIG}
        headerTitle='收货通知单列表'
        search={{ labelWidth: 'auto' }}
        revalidateOnFocus={false}
        rowKey='id'
        columns={columns}
        tableAlertRender={false}
        actionRef={proTableRef}
        rowSelection={rowSelection}
        toolBarRender={() => [
          <Button onClick={createReport} type='primary'>
            创建整改单
          </Button>,
          <Button
            type='primary'
            onClick={() => {
              editRecord('create');
            }}
          >
            创建窜货表单
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
          <Button loading={exportLoading} onClick={exportFile} type='primary'>
            导出
          </Button>,
        ]}
        request={async (params) => {
          const newParams = {
            ...params,
            startTime: params.startTime && params.startTime[0],
            endTime: params.startTime && params.startTime[0],
          };
          return fleeingReceivingFormControllerList(newParams).then((res) => handleProTableRes(res));
        }}
      />
    </Fragment>
  );
  function editRecord(type) {
    if (selectedRowKeys.length != 1) {
      message.error('请选择一行数据！');
      return;
    }
    if (type == 'create') {
      openPage({
        pathname: `/fleeingManagement/fleeingPunishmentList/fleeingForm`,
        query: { noticeBillId: selectedRowKeys[0] },
        name: '窜货表单',
      });
      return;
    }
    openPage({
      pathname: `/processForm/noticeBill/${selectedRowKeys[0]}`,
      query: { id: selectedRowKeys[0], type },
      name: '收货通知单',
    });
  }
  // 整改单跳转
  function createReport() {
    if (selectedRowKeys.length !== 1) {
      message.warn('请选择一行数据');
      return;
    }
    getFleeingReceiving(selectedRowKeys[0]).then(res => {
      if (res.code === '00000') {
        openPage({
          pathname: `/fleeingForm/rectificationForm/${selectedRowKeys[0]}`,
          state: {
            isAdd: true,
            ...res.data,
          },
          name: '整改验收单',
        });
      } 
    })
  }
  function handleChaneldatabase({ data = [] }) {
    return Object.keys(data).map((key) => ({
      label: data[key],
      value: key,
    }));
  }
  // 导出
  async function exportFile() {
    setExportLoading(true);
    let res = await exportExcels({});
    downLoadFile(res, '收货通知单');
    setExportLoading(false);
  }
}

export default NoticeBillList;
