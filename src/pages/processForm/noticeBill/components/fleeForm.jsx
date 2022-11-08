/*
 * @Author: wangrui
 * @Date: 2022-08-29 09:00:16
 * @LastEditors: wangrui
 * @Description:
 * @LastEditTime: 2022-09-23 10:24:14
 */
import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import { ProForm, ProFormText, ProFormTextArea, ProFormDigit, ProFormSelect } from '@ant-design/pro-components';
import { fromProps, enumsUnit, enumsBoolean } from '../../config';
import { Row, Col, Select } from 'antd';
import { findSalesmanByOrgCode, dealerBranchUerInfo } from './../service';
const { Option } = Select;

function ManageForm({ initialData, disabled }, ref) {
  const formRef = useRef();
  const [initialValue, setInitialValues] = useState({});
  const [receivingBranchOptions, setReceivingBranchOptions] = useState([]);
  const [receivingPersonnelOptions, setreceivingPersonnelOptions] = useState([]);
  const [receivingBranchPersonnelOptions, setreceivingBranchPersonnelOptions] = useState([]);
  useImperativeHandle(ref, () => ({
    ...formRef.current,
  }));

  useEffect(() => {
    formRef?.current?.setFieldsValue({ ...initialData });
    setInitialValues(initialData);
    console.log('initialData---', initialData);
    getReceivingBranchOptions(initialData);
  }, [initialData]);
  return (
    <ProForm {...fromProps(formRef)} disabled={disabled}>
      <Col span={24}>
        <Row>
          <ProFormText disabled name='formNum' label='窜货编号' />
        </Row>
      </Col>
      <ProFormText disabled name='forensicsBranchName' label='取证方分公司' />
      <ProFormText name='forensicsPersonnel' label='取证业务员' />

      <ProFormSelect
        name='branchPersonnelCode'
        label='取证方分公司负责人'
        dependencies={['forensicsBranchCode']}
        request={(params) => {
          if (!params?.forensicsBranchCode) return [];
          return findSalesmanByOrgCode({ ...params, orgCode: params.forensicsBranchCode, searchVal: params.keyWords }).then((res) => res.data.rows);
        }}
        debounceTime={500}
        params={{
          current: 1,
          size: 20,
        }}
        fieldProps={{
          labelInValue: true,
          fieldNames: { label: 'fullName', value: 'userName' },
          showSearch: true,
          optionItemRender(item) {
            return item.fullName + ' - ' + item.userName;
          },
        }}
      />
      <ProFormSelect
        name='receivingBranchCode'
        fieldProps={{
          labelInValue: true,
          fieldNames: { label: 'branchName', value: 'branchCode' },
          options: receivingBranchOptions,
          onChange: receivingBranchChange,
        }}
        label='收货方分公司'
      />
      <ProFormSelect
        name='receivingPersonnel'
        label='收货方业务员'
        fieldProps={{
          labelInValue: true,
          fieldNames: { label: 'fullName', value: 'userName' },
          options: receivingPersonnelOptions,
          optionItemRender(item) {
            return item.fullName + ' - ' + item.userName;
          },
        }}
      />
      <ProFormSelect
        name='receivingBranchPersonnelCode'
        fieldProps={{
          labelInValue: true,
          fieldNames: { label: 'fullName', value: 'userName' },
          showSearch: true,
          options: receivingBranchPersonnelOptions,
          optionItemRender(item) {
            return item.fullName + ' - ' + item.userName;
          },
        }}
        label='收货方分公司负责人'
      />
      <Col span={24}>
        <Row>
          <ProFormSelect
            name='salePersonnel'
            label='负责窜货经销商业务员'
            fieldProps={{
              labelInValue: true,
              fieldNames: { label: 'fullName', value: 'userName' },
              showSearch: true,
              options: receivingBranchPersonnelOptions,
              optionItemRender(item) {
                return item.fullName + ' - ' + item.userName;
              },
            }}
          />
          <ProFormSelect
            name='saleDivision'
            label='负责窜货经销城市经理/业务主办'
            fieldProps={{
              labelInValue: true,
              fieldNames: { label: 'fullName', value: 'userName' },
              showSearch: true,
              options: receivingBranchPersonnelOptions,
              optionItemRender(item) {
                return item.fullName + ' - ' + item.userName;
              },
            }}
          />
        </Row>
      </Col>
      <Col span={24}>
        <Row>
          <ProFormText name='chargePersonnel' label='扰乱市场秩序经销商责任人' />
          <ProFormText name='chargeConsumerPhone' label='扰乱市场秩序经销商电话' />
        </Row>
      </Col>

      <ProFormText hidden={true} disabled name='forensicsBranchCode' label='取证方分公司'></ProFormText>
    </ProForm>
  );
  // 获取分公司
  async function getReceivingBranchOptions(value) {
    if (!value.fleeingReceivingGoodsDetailsVoList) return;
    const code = value?.fleeingReceivingGoodsDetailsVoList[0]?.dealerCode;
    const { data = [] } = await dealerBranchUerInfo(code);
    setReceivingBranchOptions(data);
    if (initialData.receivingBranchCode) {
      const { userInfos = [] } = data.find((item) => item.branchCode == initialData.receivingBranchCode.value);
      receivingBranchChange({ value: initialData.receivingBranchCode.value }, { userInfos: userInfos || [] }, false);
    }
  }
  // 收货方分公司下拉选择
  async function receivingBranchChange({ value }, array, isReset = true) {
    const { userInfos } = array;
    setreceivingPersonnelOptions(userInfos);
    const params = {
      current: 1,
      size: 1000,
      orgCode: value,
    };
    const { data = {} } = await findSalesmanByOrgCode(params);
    isReset &&
      formRef?.current?.setFieldsValue({
        receivingPersonnel: null,
        receivingBranchPersonnelCode: null,
        salePersonnel: null,
        saleDivision: null,
      });
    setreceivingBranchPersonnelOptions(data?.rows || []);
  }
}

export default forwardRef(ManageForm);
