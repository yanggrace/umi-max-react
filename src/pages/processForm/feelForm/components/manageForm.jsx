import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { ProForm, ProFormText, ProFormTextArea, ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
import { fromProps, enumsBoolean2 } from '../../config';
import { Row, Col, Select, Form } from 'antd';
import { productUnit } from '../service';

function ManageForm({ disabled }, ref) {
  const formRef = useRef();
  const [enumsUnit, setEnumsUnit] = useState([]);
  useImperativeHandle(ref, () => ({ ...formRef.current }));
  useEffect(() => {
    initData();
  }, []);
  return (
    <ProForm {...fromProps(formRef)}>
      <ProFormText disabled={disabled} rules={[{ required: true }]} name='themeName' label='标题' />
      <ProFormText disabled name='formNum' label='表单号' />
      <ProFormText disabled name='tabulationDate' label='制表日期' />
      <ProFormText disabled name='fullName' label='申请人' />
      <ProFormText disabled name='deptName' label='所属部门' />
      <Col span={24}>
        <Row>
          <ProFormDigit
            min={1}
            disabled={disabled}
            name='quantitySeen'
            label='见货数量'
            rules={[{ required: true }]}
            fieldProps={{
              precision: 0,
              addonAfter: <SelectAfter filed='unitSeen' />,
            }}
          />
          <ProFormDigit
            min={1}
            disabled={disabled}
            name='quantityRecycling'
            label='回收数量'
            rules={[{ required: true }]}
            fieldProps={{
              precision: 0,
              addonAfter: <SelectAfter filed='unitRecycling' />,
            }}
          />
          <ProFormSelect disabled={disabled} rules={[{ required: true }]} request={() => enumsBoolean2} name='isRecyclingGift' label='是否为回收礼品' />
        </Row>
      </Col>
      <ProFormText disabled name='regionName' label='取证方事业部' />
      <ProFormText disabled name='branchName' label='取证方分公司' />
      <ProFormText disabled name='forensicsPersonnel' label='取证方人员' />
      <Col span={24}>
        <Row>
          <ProFormDigit disabled={disabled} fieldProps={{ precision: 0 }} min={1} name='nowBuyAllBox' label='本次购买总箱数' />
          <ProFormTextArea disabled={disabled} name='specialDescription' label='特殊情况说明' />
        </Row>
      </Col>
      <ProFormText disabled name='id' label='主键' hidden />
      <ProFormText disabled name='regionCode' label='取证方事业部' hidden />
      <ProFormText disabled name='branchCode' label='取证方分公司' hidden />
    </ProForm>
  );
  function SelectAfter({ filed }) {
    return (
      <Form.Item initialValue={0} name={filed} noStyle>
        <Select disabled={disabled} options={enumsUnit} fieldNames={{ label: 'unitName', value: 'unitCode' }} style={{ width: 60 }} />
      </Form.Item>
    );
  }
  async function initData() {
    try {
      let res = await productUnit();
      setEnumsUnit(res.data);
    } catch (err) {}
  }
}

export default forwardRef(ManageForm);
