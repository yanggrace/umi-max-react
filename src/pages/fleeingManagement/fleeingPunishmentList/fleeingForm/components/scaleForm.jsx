/*
 * @Author: wangrui
 * @Date: 2022-09-06 10:34:35
 * @LastEditors: wangrui
 * @Description: 扫码情况
 * @LastEditTime: 2022-09-07 09:50:34
 */
import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { Table, Row, Col, InputNumber } from 'antd';
const scales_columns = [
  {
    title: '产品',
    dataIndex: 'name',
    key: 'year',
    width: 150,
    editable: true,
  },
  {
    title: '月份',
    dataIndex: 'num',
    key: 'num',
    width: 150,
  },
  {
    title: '月度跨区域扫码',
    dataIndex: 'num1',
    key: 'count',
    width: 150,
  },
];
function ScaleForm({ initialData, disabled }, ref) {
  const formRef = useRef();
  useImperativeHandle(ref, () => ({
    formRef,
  }));
  return (
    <>
      <Row>
        <Col span={12}>
          <Table rowKey='id' pagination={false} bordered={true} columns={scales_columns} dataSource={[]}></Table>
        </Col>

        <Col span={12}>
          <Table rowKey='id' pagination={false} bordered={true} columns={scales_columns} dataSource={[]}></Table>
        </Col>
      </Row>
    </>
  );
}
export default forwardRef(ScaleForm);
