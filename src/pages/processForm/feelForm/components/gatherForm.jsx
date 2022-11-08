import React, { useState } from 'react';
import { Table, Input } from 'antd';
import { cloneDeep } from 'lodash';
const { TextArea } = Input;

function GatherForm({ dataSource, setDataSource, disabled }) {
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
      title: '鉴定人',
      dataIndex: 'appraiser',
      fixed: 'left',
      width: 200,
      render: (text, record, index) => (
        <TextArea
          disabled={disabled}
          value={text}
          autoSize
          onChange={(e) => {
            colChangeValue(e.target.value, 'appraiser', index);
          }}
          placeholder='请输入鉴定人'
        />
      ),
    },
    {
      title: '被窜市场（省市区）',
      dataIndex: 'market',
      width: 200,
    },
    {
      title: '窜货经销商',
      dataIndex: 'dealerName',
      width: 200,
    },
    {
      title: '提货日期',
      dataIndex: 'factoryDate',
      width: 200,
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      width: 200,
    },
    {
      title: '产品类型',
      dataIndex: 'channelName',
      width: 200,
    },
    {
      title: '回收数量(瓶)',
      dataIndex: 'quantityRecycling',
      width: 200,
    },
  ];

  return (
    <Table rowKey='dealerCode' size='small' pagination={false} dataSource={dataSource} columns={columns} scroll={{ x: columns.reduce((m, n) => m + n.width, 0), y: 300 }} recordCreatorProps={false} />
  );
  // 行输入
  function colChangeValue(e, field, index) {
    let newDataSource = cloneDeep(dataSource);
    newDataSource[index][field] = e;
    setDataSource(newDataSource);
  }
}

export default GatherForm;
