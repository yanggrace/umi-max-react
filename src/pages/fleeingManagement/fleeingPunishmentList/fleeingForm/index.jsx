/*
 * @Author: wangrui
 * @Date: 2022-08-23 14:38:11
 * @LastEditors: wangrui
 * @Description:窜货表单
 * @LastEditTime: 2022-09-23 11:27:20
 */
import { useState, useRef, useEffect } from 'react';
import { fleeing_columns, product_column } from './config';
import { Collapse, Row, Col, Button, Space, message } from 'antd';
import { openPage, backPage, getParams as getQueryParams } from '@/utils/windowLayout';
import FleeTimeForm from './components/fleeTimeForm';
import ProductInfoFrom from './components/productInfoFrom';
import ManageInfoForm from './components/mangeInfoForm';
import ScaleForm from './components/scaleForm';
import ExamineForm from './components/examineForm';
import { getNoticeBillDetail, updateBySeriousEnum, saveFleeingManagementForm, updateFleeingManagementForm, fleeingQueryById } from './../serveice';
const { Panel } = Collapse;
let initialDefaultdata = {};
function FleeingForm() {
  const [collapseActiveKey, setCollapseActiveKey] = useState(['1', '3']);
  const [disabled, setDisabled] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const manageInfoRef = useRef();
  const fleeTimeRef = useRef();
  const productInfoRef = useRef();
  const scaleRef = useRef();
  const examineRef = useRef();

  useEffect(() => {
    const { query, state } = getQueryParams();
    if (query.noticeBillId) {
      getNoticeBillDel(query.noticeBillId);
      setDisabled(true);
    }
    if (query.id) {
      getDetails(query.id);
    }

    console.log('query', query, state);
  }, []);

  return (
    <Row>
      <Col span={24}>
        <Space>
          <Button type='primary' onClick={submit}>
            提交
          </Button>
          <Button onClick={handleBackPage} type='primary' danger>
            返回
          </Button>
        </Space>
      </Col>
      <Col style={{ marginTop: '20px' }} span={24}>
        <Collapse defaultActiveKey={collapseActiveKey} expandIconPosition='end'>
          <Panel header='管理信息' key='1'>
            <ManageInfoForm ref={manageInfoRef} initialData={initialValues} updateBySerious={updateBySerious} />
          </Panel>
          <Panel header='经销商历史窜货次数' key='2'>
            <FleeTimeForm ref={fleeTimeRef} initialData={initialValues.fleeingReceivingYearCountVOS || []} />
          </Panel>
          <Panel header='产品信息' key='3'>
            <ProductInfoFrom ref={productInfoRef} initialData={initialValues.fleeingManagementProductVoList} />
          </Panel>
          <Panel header='扫码情况' key='4'>
            <ScaleForm ref={scaleRef} />
          </Panel>
          <Panel header='审核状态' key='5'>
            <ExamineForm ref={examineRef} />
          </Panel>
        </Collapse>
      </Col>
    </Row>
  );
  // 获取收货单详情
  async function getNoticeBillDel(id) {
    const { data } = await getNoticeBillDetail(id);
    console.log('详情数据：', data);
    setInitialValues(data);
  }
  // 返回
  function handleBackPage() {
    backPage();
  }
  // 提交
  async function submit() {
    let params = await getParams();
    let res;
    if (initialDefaultdata.id) {
      res = await updateFleeingManagementForm({ ...initialValues, ...params });
    } else {
      const {
        chooseDealerCode, // 经销商
        chooseDealerName,
        branchCode, // 分办
        branchName,
        regionCode, // 大区编码
        regionName,
        occurrenceMunicipalityCode, // 省市区
        occurrenceMunicipalityName,
        occurrenceProvinceCode,
        occurrenceProvinceName,
        occurrenceRegionCode,
        occurrenceRegionName,
        id,
      } = initialValues;
      console.log('id', id);
      params = {
        dealerCode: chooseDealerCode,
        dealerName: chooseDealerName,
        branchCode,
        branchName,
        regionCode,
        regionName,
        occurrenceMunicipalityCode,
        occurrenceMunicipalityName,
        occurrenceProvinceCode,
        occurrenceProvinceName,
        occurrenceRegionCode,
        occurrenceRegionName,
        fleeingReceivingId: id,
        ...params,
      };
      res = await saveFleeingManagementForm(params);
    }

    if (res?.code === '00000') {
      message.success('操作成功');
      openPage({ pathname: `/fleeingManagement/fleeingPunishmentList`, name: '窜货处罚管理列表' }, true);
    }
  }
  // 获取提交基础参数
  async function getParams() {
    const manageInfo = await manageInfoRef.current.validateFields();
    const fleeingManagementProductVoList = productInfoRef.current.productDataList;
    const params = {
      ...manageInfo,
      fleeingManagementProductVoList,
    };
    return params;
  }
  // 切换是否严重窜货
  async function updateBySerious(serious) {
    const { chooseDealerCode, chooseDealerName, dealerCode, dealerName } = initialValues;
    const params = {
      ...initialValues,
      dealerCode: chooseDealerCode || dealerCode,
      dealerName: chooseDealerName || dealerName,
      serious,
    };
    const { data } = await updateBySeriousEnum(params);
    setInitialValues({
      ...initialValues,
      ...data,
    });
    console.log('跟新是否严重窜货', data);
  }
  // 获取详情
  async function getDetails(id) {
    const { data } = await fleeingQueryById(id);
    console.log('res', data);
    setInitialValues(data);
  }
}
export default FleeingForm;
