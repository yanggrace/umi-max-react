/*
 * @Author: wangrui
 * @Date: 2022-08-18 10:07:43
 * @LastEditors: wangrui
 * @Description: 假冒侵权报表
 * @LastEditTime: 2022-09-27 16:29:35
 */
import { getListData, statusEnum } from './service';

import { Fragment, useRef, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { handleProTableRes } from '@/utils/index';
import { Button, message } from 'antd';
import { openPage } from '@/utils/windowLayout';

const columns = [
  { title: '序号', dataIndex: 'index', valueType: 'index', width: 48 },
  { title: '标题', dataIndex: 'registrationName', hideInSearch: true },
  { title: '表单号', dataIndex: 'registrationCode' },
  {
    title: '制表日期',
    dataIndex: 'createDate',
    valueType: 'date',
  },
  {
    title: '提交状态',
    dataIndex: 'status',
    valueType: 'select',
    fieldProps: { fieldNames: { label: 'typeName', value: 'typeCode' } },
    request: () => statusEnum().then((res) => res.data),
  },
  { title: '发现地点', dataIndex: 'caseAddress', hideInSearch: true },
  { title: '提报人', dataIndex: 'createName', hideInSearch: true },
];

function reportlist() {
  const actionRef = useRef();
  const [selectedRow, setSelectedRow] = useState([]);
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
        rowKey='id'
        options={{ reload: false }}
        tableAlertRender={false}
        toolBarRender={() => [
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
        columns={columns}
        rowSelection={rowSelection}
        actionRef={actionRef}
        headerTitle='假冒侵权登记列表'
        request={(params) => getListData(params).then((res) => handleProTableRes(res))}
      />
    </Fragment>
  );
  function editRecord(type) {
    if (!selectedRow.length) {
      message.error('请至少选择一行数据！');
      return;
    }
    openPage({
      pathname: `/counterfeitingReport/reportForm/${selectedRow[0].id}`,
      state: {
        pageType: type,
        id: selectedRow[0].id,
      },
      name: `${type == 'edit' ? '编辑' : '查看'}案件登记单`,
    });
  }
}

export default reportlist;
