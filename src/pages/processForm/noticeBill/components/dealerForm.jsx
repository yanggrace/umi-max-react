/*
 * @Author: wangrui
 * @Date: 2022-08-29 09:00:16
 * @LastEditors: wangrui
 * @Description:
 * @LastEditTime: 2022-08-31 09:11:51
 */
import React, { forwardRef, useImperativeHandle, useRef, useEffect } from 'react';
import { ProForm, ProFormText, ProFormDigit, ProFormDatePicker, ProFormSelect, ProFormCascader } from '@ant-design/pro-components';
import { fromProps, enumsUnit, enumsBoolean } from '../../config';
import { Row, Col, Select } from 'antd';
import { getArea, getProductList } from '../service';
const { Option } = Select;
const natureEnums = [
  { label: '一级', value: '1' },
  { label: '团购', value: '2' },
];
function DealerForm({ initialData, disabled }, ref) {
  const formRef = useRef();
  useImperativeHandle(ref, () => ({
    ...formRef.current,
  }));
  useEffect(() => {
    formRef?.current?.setFieldsValue({ ...initialData });
  }, [initialData]);
  return (
    <ProForm {...fromProps(formRef)} disabled={disabled}>
      <ProFormText name='fullName' label='与公司签合同的经销商全称' />
      <ProFormText name='nature' label='性质' />

      <ProFormDatePicker
        name='startDate'
        fieldProps={{
          picker: 'month',
          format: 'YYYY-MM',
          style: { width: '100%' },
        }}
        label='经销我公司产品最早开始时间'
      />
      <ProFormDigit fieldProps={{ addonAfter: '万元' }} label='上一年度销售额' name='lastYearSales' />
      <ProFormDigit fieldProps={{ addonAfter: '万元' }} label='本年度销售额' name='currentYearSales' />
      <ProFormText name='varieties' label='经销品种' />
      <ProFormText name='placeOfDealer' label='经销商籍贯' />
      <ProFormText name='cooperationProduct' label='窜货产品合作情况' />
      <ProFormText name='otherVarieties' label='其他产品合作情况及品种' />
      <ProFormText name='otherAccountNames' label='该经销商与公司签约的其他账户名称' />
      <ProFormText name='expressCompany' label='邮寄快递公司名称' />
      <ProFormText name='waybillNo' label='运单编号' />
      <ProFormText name='deliveryDate' label='寄出日期' />
      <ProFormText name='sender' label='寄件人' />
    </ProForm>
  );
}

export default forwardRef(DealerForm);
