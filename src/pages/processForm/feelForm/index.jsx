import React, { useState, useRef, useEffect } from 'react';
import { Row, Col, Button, Space, Collapse, message } from 'antd';
import FileForm from './components/fileForm';
import ManageForm from './components/manageForm';
import QueryCodeForm from './components/queryCodeForm';
import GatherForm from './components/gatherForm';
import OtherForm from './components/otherForm';
import { beginningData, saveCheckReportMain, reportInfo } from './service';
import { getParams, openPage, backPage } from '@/utils/windowLayout';
import '../index.less';
import { getFileUrl, layoutFileList } from '@/utils/index';
import { cloneDeep, debounce } from 'lodash';

const debounceFun = debounce((func, e) => {
  func(e);
}, 1000);
const { Panel } = Collapse;

function FeelForm() {
  const [params, setParams] = useState(getParams().state);
  const formType = params.type || ''; // 1:价格 2:窜货
  const pageType = params.pageType || 'add'; // add:新增 edit:编辑 view:查看
  const [isShowButton, setIsShowButton] = useState(pageType == 'add');
  const disabled = pageType == 'view';
  const [loading, setLoading] = useState(false);
  const [branchCode, setBranchCode] = useState('');
  const [queryCodeFormData, setQueryCodeFormData] = useState([]);
  const [gatherFormData, setGatherFormData] = useState([]);
  const [activeKey, setActiveKey] = useState(['1', '2', '3', '4', '5']);
  const fileForm = useRef();
  const manageForm = useRef();
  const otherForm = useRef();
  useEffect(() => {
    if (pageType == 'add') {
      beginningInit();
      return;
    }
    getDetailsData();
  }, []);
  useEffect(() => {
    debounceFun(layoutData);
  }, [queryCodeFormData]);
  return (
    <Row>
      <Col span={24}>
        <Space>
          {isShowButton && (
            <Button loading={loading} onClick={temporarySave.bind(this, 1)} type='primary'>
              暂存
            </Button>
          )}
          {pageType != 'view' && (
            <Button loading={loading} onClick={temporarySave.bind(this, 2)} type='primary'>
              提交
            </Button>
          )}
          <Button type='primary'>查看流程图</Button>
          <Button type='primary'>打印</Button>
          <Button onClick={backPage} type='primary' danger>
            返回
          </Button>
        </Space>
      </Col>
      <Col style={{ marginTop: '20px' }} span={24}>
        <Collapse expandIconPosition='end' onChange={setActiveKey} activeKey={activeKey}>
          <Panel forceRender header='附件关联信息' key='1'>
            <FileForm disabled={disabled} ref={fileForm} />
          </Panel>
          <Panel forceRender header='管理信息' key='2'>
            <ManageForm disabled={disabled} ref={manageForm} />
          </Panel>
          <Panel forceRender header='箱瓶码查询表' key='3'>
            <QueryCodeForm disabled={disabled} branchCode={branchCode} dataSource={queryCodeFormData} setDataSource={setQueryCodeFormData} />
          </Panel>
          <Panel forceRender header='汇总' key='4'>
            <GatherForm disabled={disabled} dataSource={gatherFormData} setDataSource={setGatherFormData} />
          </Panel>
          <Panel forceRender header='其他' key='5'>
            <OtherForm disabled={disabled} ref={otherForm} />
          </Panel>
        </Collapse>
      </Col>
    </Row>
  );
  // 初始化汇总数据
  function layoutData() {
    let newData = [];
    queryCodeFormData.forEach((v) => {
      let index = newData.findIndex((m) => m.dealerCode == v.dealerCode);
      if (index != -1) {
        if (
          !(newData[index].factoryDate.some(m => m == v.factoryDate) &&
            newData[index].productCode.some(m => m == v.productCode) &&
            newData[index].channelCode.some(m => m == v.channelCode))
        ) {
          if (v.factoryDate) newData[index].factoryDate.push(v.factoryDate);
          if (v.productCode) newData[index].productCode.push(v.productCode);
          if (v.productName) newData[index].productName.push(v.productName);
          if (v.channelName) newData[index].channelName.push(v.channelName);
          if (v.channelCode) newData[index].channelCode.push(v.channelCode);
        }
        newData[index].quantityRecycling = newData[index].quantityRecycling + (v.quantity || 0);
      } else {
        if (v.dealerCode) {
          let item = gatherFormData.find((m) => m.dealerCode == v.dealerCode) || {};
          newData.push({
            ...item,
            market: (v.terminalProvinceName || '') + (v.terminalCityName || '') + (v.terminalAreaName || ''),
            dealerCode: v.dealerCode,
            dealerName: v.dealerName,
            factoryDate: v.factoryDate ? [v.factoryDate] : [],
            productCode: v.productCode ? [v.productCode] : [],
            productName: v.productName ? [v.productName] : [],
            channelName: v.channelName ? [v.channelName] : [],
            channelCode: v.channelCode ? [v.channelCode] : [],
            quantityRecycling: v.quantity || 0,
          });
        }
      }
    });
    newData = newData.map((v) => ({
      ...v,
      factoryDate: v.factoryDate.join(','),
      productCode: v.productCode.join(','),
      productName: v.productName.join(','),
      channelName: v.channelName.join(','),
      channelCode: v.channelCode.join(','),
    }));
    setGatherFormData(newData);
  }
  // 新增时候初始化数据 type为1：新增价格 2：新增窜货 edit：编辑 view：查看
  async function beginningInit() {
    try {
      let { data } = await beginningData(params);
      setBranchCode(data.branchCode);
      const newData = Array.isArray(data.listFleeing)
        ? data.listFleeing.map((v) => ({
          ...v,
          forensiscId: v.parentId,
          forensiscInfoId: v.id,
          buyTime: v.createDate,
        }))
        : [];
      manageForm.current.setFieldsValue({
        regionName: data.regionName,
        regionCode: data.regionCode,
        branchName: data.branchName,
        branchCode: data.branchCode,
        forensicsPersonnel: data.forensicsPersonnel,
      });
      setQueryCodeFormData(newData);
    } catch (err) { }
  }
  // 查看详情
  async function getDetailsData() {
    try {
      let { data } = await reportInfo({
        type: formType,
        id: params.id,
      });
      let fileFormValue = {};
      setBranchCode(data.branchCode);
      setIsShowButton(data.status === 1);
      if (data.checkReport) fileFormValue.checkReport = layoutFileList(data.checkReport);
      if (data.evidence) fileFormValue.evidence = layoutFileList(data.evidence);
      if (data.associatedDocuments) fileFormValue.associatedDocuments = layoutFileList(data.associatedDocuments);
      if (data.other) fileFormValue.other = layoutFileList(data.other);
      fileForm.current.setFieldsValue(fileFormValue);
      manageForm.current.setFieldsValue(data);
      setQueryCodeFormData(data.checkReportMainProductInfoVO);
      setGatherFormData(data.checkReportMainCollectVO);
      otherForm.current.setFieldsValue(data);
    } catch (err) { }
  }
  // 暂存/提交
  async function temporarySave(status) {
    let fileFormData = await fileForm.current.validateFields();
    let manageFormData = await manageForm.current.validateFields();
    let otherFormData = await otherForm.current.validateFields();
    for (let i in fileFormData) {
      if (fileFormData[i]) {
        fileFormData[i] = getFileUrl(fileFormData[i]);
      }
    }
    if (status == 2) {
      for (let i = 0; i < queryCodeFormData.length; i++) {
        const item = queryCodeFormData[i];
        const colIndex = i + 1;
        if (!item.productCode) {
          return message.error(`第${colIndex}行未选择产品`);
        }
        if (!item.botCode && !item.boxCode) {
          return message.error(`第${colIndex}行箱码/瓶码必填其一`);
        }
        if (item.boxCode && !item.boxProductionDate) {
          return message.error(`第${colIndex}行未选择箱生产日期`);
        }
        if (item.botCode && !item.botProductionDate) {
          return message.error(`第${colIndex}行未选择瓶生产日期`);
        }
        if (!isBoolean(item.isStamp)) {
          return message.error(`第${colIndex}行未选择是否盖章`);
        }
        if (!item.stampInstructions) {
          return message.error(`第${colIndex}行未填写盖章盖章情况说明`);
        }
        if (!item.logisticNo) {
          return message.error(`第${colIndex}行未填写箱瓶物流码`);
        }
        if (!item.dealerCode) {
          return message.error(`第${colIndex}行未选择窜货经销商`);
        }
        if (!item.factoryDate) {
          return message.error(`第${colIndex}行未选择提货日期`);
        }
        if (!isBoolean(item.isBadMarkNum)) {
          return message.error(`第${colIndex}行未选择毁坏物流标识`);
        }
        if (!item.unit) {
          return message.error(`第${colIndex}行未输入提货数量`);
        }
        if (!item.wholesalePrice) {
          return message.error(`第${colIndex}行未输入批发价格`);
        }
        if (!item.singlePrice) {
          return message.error(`第${colIndex}行未输入购买价格`);
        }
        if (!item.localPrice) {
          return message.error(`第${colIndex}行未输入当地市场价格`);
        }
        if (!item.quantity) {
          return message.error(`第${colIndex}行未输入数量`);
        }
        if (!item.buyTime) {
          return message.error(`第${colIndex}行未选择购买时间`);
        }
      }
      for (let i = 0; i < gatherFormData.length; i++) {
        const item = gatherFormData[i];
        const colIndex = i + 1;
        if (!item.appraiser) {
          return message.error(`第${colIndex}行未输入鉴定人`);
        }
      }
    }
    let body = {
      ...fileFormData,
      ...manageFormData,
      ...otherFormData,
      checkReportMainProductInfoVO: queryCodeFormData,
      checkReportMainCollectVO: gatherFormData,
      type: formType,
      status,
    };
    try {
      setLoading(true);
      let res = await saveCheckReportMain(body);
      setLoading(false);
      if (res.code == '00000') {
        if (pageType == 'add') {
          openPage(
            {
              pathname: '/reportsCenter/checkList',
              name: '窜货核查列表',
            },
            true
          );
          return;
        }
        backPage(true);
      }
    } catch (err) {
      setLoading(false);
    }
  }
  // 判断是不是布尔类型的值
  function isBoolean(code) {
    return typeof code === 'boolean';
  }
  //
  function isNumber(code) {
    return typeof code === 'number';
  }
}

export default FeelForm;
