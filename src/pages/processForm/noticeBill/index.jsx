import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Button, Space, Collapse, message } from 'antd';
import FileForm from './components/fileForm';
import ManageForm from './components/manageForm';
import FleeForm from './components/fleeForm';
import RecoveryForm from './components/recoveryForm';
import DealerForm from './components/dealerForm';
import { openPage, backPage, getParams as getQueryParams } from '@/utils/windowLayout';
import { isEmpty } from 'lodash';

import { getDetail, saveFleeingReceivingForm, updateFleeingReceivingForm } from './service';
import '../index.less';
const { Panel } = Collapse;
let initialDefaultdata = {};
function NoticeBill() {
  const fileForm = useRef();
  const fleeForm = useRef();
  const manageForm = useRef();
  const recoveryForm = useRef();
  const dealerForm = useRef();
  const [activeKey, setActiveKey] = useState(['1', '2', '3', '4', '5']);
  const [disabled, setDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [initialData, setInitialData] = useState({
    fileFormData: [],
    manageFormData: {},
    fleeFormData: {},
    recoveryFormData: [],
    dealerFormData: {},
  });
  useEffect(() => {
    getDetails();
  }, []);
  return (
    <Row>
      <Col span={24}>
        <Space>
          <Button type='primary' loading={isLoading} onClick={() => submit(1)}>
            暂存
          </Button>
          <Button type='primary' loading={isLoading} onClick={() => submit(2)}>
            提交
          </Button>
          <Button type='primary'>查看流程图</Button>
          <Button type='primary'>打印</Button>
          <Button onClick={handleBackPage} type='primary' danger>
            返回
          </Button>
        </Space>
      </Col>
      <Col style={{ marginTop: '20px' }} span={24}>
        <Collapse onChange={setActiveKey} activeKey={activeKey}>
          <Panel forceRender header='附件关联信息' key='1'>
            <FileForm ref={fileForm} initialData={initialData} disabled={disabled} />
          </Panel>
          <Panel forceRender header='管理信息' key='2'>
            <ManageForm ref={manageForm} initialData={initialData} disabled={disabled} />
          </Panel>
          <Panel forceRender header='窜货情况' key='3'>
            <FleeForm ref={fleeForm} initialData={initialData} disabled={disabled} />
          </Panel>
          <Panel forceRender header='回收情况' key='4'>
            <RecoveryForm ref={recoveryForm} initialData={initialData.fleeingReceivingGoodsDetailsVoList} disabled={disabled} />
          </Panel>
          <Panel forceRender header='经销商情况' key='5' initialData={initialData}>
            <DealerForm ref={dealerForm} initialData={initialData} disabled={disabled} />
          </Panel>
        </Collapse>
      </Col>
    </Row>
  );
  // 查看详情
  async function getDetails() {
    const { query = {}, state } = getQueryParams();
    initialDefaultdata = state;
    console.log('新增参数', isEmpty(state), state);

    if (!isEmpty(state)) {
      const { terminalAreaCode, terminalAreaName, terminalCityCode, terminalCityName, terminalProvinceCode, terminalProvinceName, type } = state.checkReportMainProductInfoVOs[0];

      setInitialData({
        fleeingReceivingGoodsDetailsVoList: state.checkReportMainProductInfoVOs,
        terminalAreaCode,
        terminalAreaName,
        terminalCityCode,
        terminalCityName,
        terminalProvinceCode,
        terminalProvinceName,
        forensicsBranchName: state.branchName,
        forensicsBranchCode: state.branchCode,
        forensicsPersonnel: state.forensicsPersonnel,
        formNum: state.formNum,
        type,
      });
    }
    if (!query.id) return;
    const { data } = await getDetail(query.id);
    if (query.type === 'view') {
      setDisabled(true);
    }
    // 拼接初始化数据
    const newData = {
      ...data,
      branchPersonnelCode: handleOptiosData(data, 'branchPersonnelName', 'branchPersonnelCode'),
      receivingBranchCode: handleOptiosData(data, 'receivingBranchName', 'receivingBranchCode'),
      receivingPersonnel: handleOptiosData(data, 'receivingPersonnelName', 'receivingPersonnel'),
      receivingBranchPersonnelCode: handleOptiosData(data, 'receivingBranchPersonnelName', 'receivingBranchPersonnelCode'),
      salePersonnel: handleOptiosData(data, 'salePersonnelName', 'salePersonnel'),
      saleDivision: handleOptiosData(data, 'saleDivisionName', 'saleDivision'),
    };
    setInitialData(newData);
  }
  // 处理查看时传入的options
  function handleOptiosData(data = {}, name, code) {
    return data
      ? {
          label: data[name],
          value: data[code],
        }
      : null;
  }
  function handleBackPage() {
    backPage();
  }
  // 提交
  async function submit(status) {
    let params = await getParams();
    const { formNum, fromID, dealerCode, dealerName } = initialDefaultdata;
    params = {
      ...params,
      formNum,
      fromID,
    };
    let res;
    setIsLoading(true);
    if (initialData.id) {
      res = await updateFleeingReceivingForm({ ...params, id: initialData.id });
    } else {
      res = await saveFleeingReceivingForm({ ...params, status, chooseDealerCode: dealerCode, chooseDealerName: dealerName });
    }
    setIsLoading(false);
    if (res?.code === '00000') {
      message.success('操作成功');
      openPage({ pathname: `/reportsCenter/noticeBillList`, name: '收货通知单列表' }, true);
    }
  }
  // 处理提交参数
  async function getParams() {
    const filed = await fileForm.current.fileList;
    const evidence = filed.map((item) => item.response?.data || item); // 附件
    let fleeFormData = await fleeForm.current.validateFields(); //窜货情况
    const newfleeFormData = {
      ...fleeFormData,
      branchPersonnelCode: fleeFormData.branchPersonnelCode?.value,
      branchPersonnelName: fleeFormData.branchPersonnelCode?.label,
      receivingBranchCode: fleeFormData.receivingBranchCode?.value,
      receivingBranchName: fleeFormData.receivingBranchCode?.label,
      receivingPersonnel: fleeFormData.receivingPersonnel?.value,
      receivingPersonnelName: fleeFormData.receivingPersonnel?.label,
      receivingBranchPersonnelCode: fleeFormData.receivingBranchPersonnelCode?.value,
      receivingBranchPersonnelName: fleeFormData.receivingBranchPersonnelCode?.label,
      salePersonnel: fleeFormData.salePersonnel?.value,
      salePersonnelName: fleeFormData.salePersonnel?.label,
      saleDivision: fleeFormData.saleDivision?.value,
      saleDivisionName: fleeFormData.saleDivision?.label,
    };
    const manageFormData = await manageForm.current.validateFields(); // 管理信息
    await recoveryForm.current.useForm.validateFields(); // 回收情况
    console.log(recoveryForm.current.dataSource);
    const fleeingReceivingGoodsDetailsVoList = recoveryForm.current.dataSource.map((item) => ({
      ...item,
      channelName: item.channelName.label,
      channelCode: item.channelName.value,
      productCode: item.productName.value,
      productName: item.productName.label,
    }));
    const dealerFormData = await dealerForm.current.validateFields(); // 经销商情况
    const params = {
      ...initialData,
      evidence,
      ...newfleeFormData,
      ...manageFormData,
      ...manageFormData.code,
      fleeingReceivingGoodsDetailsVoList,
      ...dealerFormData,
    };
    return params;
  }
}

export default NoticeBill;
