/*
 * @Author: wangrui
 * @Date: 2022-09-06 10:40:02
 * @LastEditors: wangrui
 * @Description: 管理信息
 * @LastEditTime: 2022-09-08 11:07:49
 */
import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { ProFormText, ProForm, EditableProTable, ProFormSelect } from '@ant-design/pro-components';
import { seriousEnum } from './../../serveice';

function ManageInfoForm({ initialData, updateBySerious, disabled }, ref) {
  const formRef = useRef();
  useEffect(() => {
    formRef.current.setFieldsValue({ ...initialData });
  }, [initialData]);
  useImperativeHandle(ref, () => ({
    ...formRef.current,
  }));
  return (
    <>
      <ProForm grid={true} submitter={false} colProps={{ span: 8 }} formRef={formRef} labelCol={{ span: 8 }} layout='horizontal'>
        <ProFormText disabled name='fleeingManagementCode' label='表单号' />
        <ProFormText disabled name='fleeingReceivingCode' label='收货通知单编码' />
        <ProFormText disabled name='createName' label='申请人' />
        <ProFormText disabled name='createDate' label='表单创建时间' />
        <ProFormText disabled name='chooseDealerName' label='经销商' />
        <ProFormText disabled name='forensicsRegionName' label='所属事业部' />
        <ProFormText disabled name='forensicsBranchName' label='所属分办' />
        <ProFormText
          disabled
          name='occurrence'
          label='窜货省市区'
          colProps={{
            span: 16,
          }}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
        />
        <ProFormSelect
          colProps={{
            offset: 0,
            span: 8,
          }}
          label='是否严重窜货'
          name='serious'
          request={() => [
            { label: '是', value: 1 },
            { label: '否', value: 2 },
          ]}
          fieldProps={{
            onChange: (value) => {
              submit(value);
            },
          }}
          rules={[{ required: true }]}
        />
      </ProForm>
    </>
  );
  // 执行
  async function submit(value) {
    console.log('serious', value);
    updateBySerious(value);
  }
  // 处理枚举
  function handleRes({ data }) {
    return Object.keys(data).map((item) => ({
      label: data[item],
      value: item,
    }));
  }
}
export default forwardRef(ManageInfoForm);
