/*
 * @Author: wangrui
 * @Date: 2022-08-19 09:22:59
 * @LastEditors: wangrui
 * @Description: 案件跟进信息
 * @LastEditTime: 2022-08-19 11:18:41
 */
import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { ProFormText, ProForm, EditableProTable, ProFormDigit, ProFormDatePicker, ProFormTextArea } from '@ant-design/pro-components';
import { columns_progress } from '../config';
function CaseProgress({ disabled }, ref) {
  const [editableKeys, setEditableRowKeys] = useState([]);
  const formRef = useRef()
  const l = {
    labelCol: { span: 6 },
    colProps: { span: 8 }
  }
  const fromProps = {
    grid: true,
    layout: 'horizontal',
    labelWrap: true,
    submitter: false
  }
  useImperativeHandle(ref, () => ({
    ...formRef.current,
    setEditableRowKeys
  }))
  return (
    <ProForm {...fromProps} formRef={formRef}>
      <ProFormDigit disabled={disabled} {...l} rules={[{ required: true }]} name='detainees' label='拘留人数' />
      <ProFormDigit disabled={disabled} {...l} rules={[{ required: true }]} name='arrests' label='逮捕人数' />
      <ProFormDigit disabled={disabled} {...l} rules={[{ required: true }]} name='sentenced' label='判刑人数' />
      <ProFormDigit disabled={disabled} {...l} rules={[{ required: true }]} name='penaltyAmount' label='处罚金额' />
      <ProFormTextArea disabled={disabled} {...l} rules={[{ required: true }]} name='disposal' fieldProps={{ autoSize: true }} label='涉案物品处理情况' />
      <ProFormDatePicker disabled={disabled} {...l} rules={[{ required: true }]} name='closingTime' label='结案时间' fieldProps={{ style: { width: '100%' } }} />
      <ProFormTextArea disabled={disabled} {...l} rules={[{ required: true }]} name='filing' fieldProps={{ autoSize: true }} label='案件材料存档情况' />
      <ProFormDatePicker disabled={disabled} {...l} rules={[{ required: true }]} name='prosecutionTime' label='移交起诉时间' fieldProps={{ style: { width: '100%' } }} />
      <ProFormText disabled={disabled} {...l} rules={[{ required: true }]} name='identificationReportNo' label='鉴定报告编号' />
      <EditableProTable
        rowKey='key'
        name='counterfeitCaseHandlingVos'
        toolBarRender={false}
        columns={columns_progress}
        recordCreatorProps={disabled ? false : {
          newRecordType: 'dataSource',
          record: () => ({
            key: Date.now(),
          }),
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          onChange: setEditableRowKeys,
          actionRender: (row, _, dom) => [dom.delete]
        }}
      />
    </ProForm>
  );
}
export default forwardRef(CaseProgress);
