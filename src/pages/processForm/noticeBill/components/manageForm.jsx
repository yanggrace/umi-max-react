/*
 * @Author: wangrui
 * @Date: 2022-08-29 09:00:16
 * @LastEditors: wangrui
 * @Description:
 * @LastEditTime: 2022-09-06 16:00:41
 */
import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { ProForm, ProFormText, ProFormSelect, ProFormCascader } from '@ant-design/pro-components';
import { fromProps, enumsUnit, enumsBoolean } from '../../config';
import { Row, Col, Select } from 'antd';
const { Option } = Select;
import { getArea } from '../service';

function ManageForm({ initialData, disabled }, ref) {
  const formRef = useRef();
  useImperativeHandle(ref, () => ({
    ...formRef.current,
  }));
  useEffect(() => {
    if (initialData.fleeingReceivingName) {
      const {
        occurrenceProvinceName,
        occurrenceMunicipalityCode,
        occurrenceMunicipalityName,
        occurrenceRegionCode,
        occurrenceRegionName,
        occurrenceProvinceCode,
        department1Name,
        department2Name,
        department3Name,
        department4Name,
        department5Name,
      } = initialData;
      const code = {
        occurrenceProvinceCode,
        occurrenceProvinceName,
        occurrenceMunicipalityCode,
        occurrenceMunicipalityName,
        occurrenceRegionCode,
        occurrenceRegionName,
        occurrence: `${occurrenceProvinceName} ${occurrenceMunicipalityName} ${occurrenceRegionName}`,
      };
      const department = [department1Name, department2Name, department3Name, department4Name, department5Name].reduce((m, n) => m + n.trim(), '');
      formRef?.current?.setFieldsValue({ ...initialData, code, area: occurrenceProvinceCode ? [occurrenceProvinceCode, occurrenceMunicipalityCode, occurrenceRegionCode] : '', department });
    }
  }, [initialData.fleeingReceivingName]);
  return (
    <ProForm {...fromProps(formRef)} disabled={disabled}>
      <ProFormText rules={[{ required: true }]} name='fleeingReceivingName' label='标题' />
      <ProFormText disabled name='fleeingReceivingCode' label='表单号' />
      <ProFormText disabled name='formNum' label='核查报告编码' />
      <ProFormText disabled name='createName' label='申请人' />
      <ProFormText disabled name='department' label='所属部门' />
      <ProFormText disabled name='createDate' label='创建时间' />
      <ProFormText name='dealerName' label='扰乱市场经销商名称' />
      <ProFormCascader
        name='area'
        label='所在地区'
        request={() => getArea().then((res) => res.data)}
        onChange={cascaderChange}
        fieldProps={{
          showSearch: true,
          fieldNames: { label: 'name', value: 'code', children: 'childRegions' },
        }}
      />
      <ProFormText name='code' label='扰乱市场经销商名称' hidden />
    </ProForm>
  );
  function cascaderChange(value, options) {
    const { code: occurrenceProvinceCode, name: occurrenceProvinceName = '' } = options[0];
    const { code: occurrenceMunicipalityCode, name: occurrenceMunicipalityName = '' } = options[1];
    const { code: occurrenceRegionCode, name: occurrenceRegionName = '' } = options[2];
    formRef.current.setFieldsValue({
      code: {
        occurrenceProvinceCode,
        occurrenceProvinceName,
        occurrenceMunicipalityCode,
        occurrenceMunicipalityName,
        occurrenceRegionCode,
        occurrenceRegionName,
        occurrence: [occurrenceProvinceName, occurrenceMunicipalityName, occurrenceRegionName].reduce((m, n) => m + n.trim(), ''),
      },
    });
  }
}

export default forwardRef(ManageForm);
