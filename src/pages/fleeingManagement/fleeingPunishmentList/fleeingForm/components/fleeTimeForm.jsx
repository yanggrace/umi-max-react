/*
 * @Author: wangrui
 * @Date: 2022-09-06 09:52:53
 * @LastEditors: wangrui
 * @Description:经销商历史窜货次数
 * @LastEditTime: 2022-09-08 09:11:32
 */
import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { Table, Row, Col, InputNumber } from 'antd';

const fleeing_columns = [
  {
    title: '经销商历史窜货次数',
    children: [
      {
        title: '年度',
        dataIndex: 'feelingYear',
        key: 'feelingYear',
        width: 150,
        editable: true,
      },
      {
        title: '年度窜货次数',
        dataIndex: 'feelingCount',
        key: 'feelingCount',
        width: 150,
      },
      {
        title: '处理次数',
        dataIndex: 'handleCount',
        key: 'handleCount',
        width: 150,
      },
    ],
  },
];
function FleeTimeForm({ initialData, disabled }, ref) {
  const formRef = useRef();
  useImperativeHandle(ref, () => ({
    formRef,
  }));
  return (
    <>
      <Row>
        <Col span={12}>
          <Table rowKey={(row) => row.feelingYear} pagination={false} bordered={true} columns={fleeing_columns} dataSource={[...initialData]}></Table>
        </Col>
      </Row>
    </>
  );
}

export default forwardRef(FleeTimeForm);
