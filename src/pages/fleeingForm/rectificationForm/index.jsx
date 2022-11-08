/*
 * @Author: wangrui
 * @Date: 2022-08-25 15:24:29
 * @LastEditors: wangrui
 * @Description:整改验收单
 * @LastEditTime: 2022-08-26 09:18:41
 */
import React, { Fragment, useRef, useState, useEffect } from 'react';
import { ProForm, ProFormText, ProFormDatePicker, ProFormCascader, ProFormTextArea, ProFormDigit } from '@ant-design/pro-components';
import { getProvinceTRee, getRectifyForm, saveRectifyForm, saveRectifyFormTemporary } from './service.js';
import { Button, Card, Input, message } from 'antd';
// import { useLocation } from '@umijs/max';
import styles from './index.less';
import { getParams } from '@/utils/windowLayout.js';
const { Group } = ProForm;
const optionLists = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    isLeaf: false,
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    isLeaf: false,
  },
];
function RectificationForm() {
  const formRef = useRef();
  // const location = useLocation();
  console.log(location)
  const { state: propsDataSource = {} } = getParams();
  console.log(propsDataSource);
  let departmentNameArr = [propsDataSource.department1Name, propsDataSource.department2Name, propsDataSource.department3Name, propsDataSource.department4Name, propsDataSource.department5Name];
  propsDataSource.departmentName = '';
  departmentNameArr.map(item => {
    if (item) {
      propsDataSource.departmentName += item;
    }
  })
  propsDataSource.occurrenceArea = propsDataSource.occurrenceProvinceName + propsDataSource.occurrenceCityName + propsDataSource.occurrenceAreaName
  propsDataSource.dealerAreaList = propsDataSource.dealerProvinceCode ? [propsDataSource.dealerProvinceCode, propsDataSource.dealerCityCode, propsDataSource.dealerAreaCode] : []
  // propsDataSource.dealerAreaList = ['310000000000', '310100000000', '310105000000']
  const [dataSource, setDataSource] = useState({ ...propsDataSource });

  return (
    <>
      <div style={{ marginBottom: '10px' }}>
        <Button type='primary' onClick={() => submit(1)} style={{ display: propsDataSource.isCheck ? 'none' : '' }}>
          暂存
        </Button>
        <Button type='primary' onClick={() => submit(2)} style={{ margin: '0 12px', display: propsDataSource.isCheck ? 'none' : '' }}>
          提交
        </Button>
        <Button type='primary'>查看流程图</Button>
      </div>
      <Card title='窜货整改验收单' extra={<div>编号：{propsDataSource.formNum}</div>}>
        <ProForm formRef={formRef} grid={true} disabled={propsDataSource.isCheck} colProps={{ span: 8 }} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }} layout='horizontal' submitter={false} initialValues={dataSource} className={styles.rectificationFormBox}>
          <ProFormText label='标题' name='titleName' width={400} />
          <Group colProps={{ span: 24 }}>
            <ProFormText label='制表人' name='createName' disabled />
            <ProFormText label='所属部门' name='departmentName' disabled />
            <ProFormDatePicker fieldProps={{ style: { width: '100%' } }} label='制表时间' name='createDate' disabled />
          </Group>
          <Group colProps={{ span: 24 }}>
            <ProFormText label='窜货经销商名称' name='dealerName' disabled />
            <ProFormText label='窜货产品名称' name='productName' disabled />
            <ProFormDigit label='数量（瓶）' name='quantity' disabled />
          </Group>
          <Group colProps={{ span: 24 }}>
            <ProFormText
              label='窜达地'
              name='occurrenceArea'
              title='occurrenceArea'
              disabled
            />
            <ProFormDatePicker fieldProps={{ style: { width: '100%' } }} label='收货时间' name='receiveTime' disabled />
            <ProFormCascader
              label='经销商所属区域'
              name='dealerAreaList'
              fieldProps={{
                fieldNames: { label: 'name', value: 'code', children: 'childRegions' },
              }}
              onChange={cascaderChage}
              request={async () => getProvinceTRee().then((res) => res.data)}
            />
          </Group>
          <Group colProps={{ span: 24 }}>
            <ProFormTextArea colProps={{ span: 16 }} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label='整改情况' name='rectifyStatus'></ProFormTextArea>
          </Group>
          <Group colProps={{ span: 24 }}>
            <ProFormTextArea colProps={{ span: 16 }} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} label='验收情况' name='acceptanceCheck'></ProFormTextArea>
          </Group>
        </ProForm>
      </Card>
    </>
  );
  /**
   *
   * @param {1:暂存，2：提交} type
   */
  function submit(type) {
    console.log(formRef.current.getFieldValue(), dataSource, '----');
    let params = formRef.current.getFieldValue();
    let newParams;
    if (propsDataSource.isAdd) {
      newParams = {
        ...dataSource,
        isCheck: undefined,
        isEdit: undefined,
        isAdd: undefined,
        dealerAreaList: undefined,
        rectifyStatus: params.rectifyStatus,
        acceptanceCheck: params.acceptanceCheck,
        titleName: params.titleName,
        fleeingReceivingId: dataSource.id,
        id: undefined
      }
    } else {
      newParams = {
        ...dataSource,
        isCheck: undefined,
        isEdit: undefined,
        isAdd: undefined,
        dealerAreaList: undefined,
        rectifyStatus: params.rectifyStatus,
        acceptanceCheck: params.acceptanceCheck,
        titleName: params.titleName,
      }
    }
    if (type === 2) {
      saveRectifyForm({ ...newParams, status: 2 }).then(res => {
        if (res.code === '00000') {
          message.success('提交成功')
        } else {
          message.error(res.message)
        }
      })
    } else {
      saveRectifyForm({ ...newParams, status: 1 }).then(res => {
        if (res.code === '00000') {
          message.success('暂存成功')
        } else {
          message.error(res.message)
        }
      })
    }
  }
  function cascaderChage(value, options) {
    console.log(value, options);
    if (options) {
      const { code: dealerProvinceCode, name: dealerProvinceName } = options[0];
      const { code: dealerCityCode, name: dealerCityName } = options[1];
      const { code: dealerAreaCode, name: dealerAreaName } = options[2];
      setDataSource({ ...dataSource, dealerProvinceCode, dealerProvinceName, dealerCityCode, dealerCityName, dealerAreaCode, dealerAreaName });
    }
  }
}
export default RectificationForm;
