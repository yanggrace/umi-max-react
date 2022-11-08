/*
 * @Author: wangrui
 * @Date: 2022-08-18 15:04:31
 * @LastEditors: wangrui
 * @Description:
 * @LastEditTime: 2022-08-19 16:57:54
 */
import { Fragment, useState, useRef, useEffect } from 'react';
import { Collapse, Table, Button, Space, Row, Col, Form, message, InputNumber } from 'antd';
import { ProFormText, ProForm, EditableProTable, ProFormSelect, ProFormTextArea, ProFormDigit } from '@ant-design/pro-components';
import { columns_suspect, BooleanEnums, fromProps } from './config';
import { getParams, openPage, backPage } from '@/utils/windowLayout';
import CaseProgress from './component/caseProgress';
import { useReactToPrint } from 'react-to-print';
import {
  counterfeitingDetails,
  counterfeit,
  getInformationSources,
  getProductPrice,
  saveOrpdateFun,
  getDetailById
} from './service'
import moment from 'moment';

const { Panel } = Collapse;

function reportForm(props) {
  // const [params, setParams] = useState({ id: '22' });
  const [params, setParams] = useState(getParams().state);
  const pageType = params.pageType || 'add';// add:新增 edit:编辑 view:查看
  const disabled = pageType == 'view';
  const [isShowButton, setIsShowButton] = useState(pageType == 'add');
  const manageForm = useRef();
  const reportFrom = useRef();
  const registerForm = useRef();
  const handleForm = useRef();
  const involvedForm = useRef();
  const progressForm = useRef();
  const componentRef = useRef(null);
  const [region, setRegion] = useState([])
  const [process, setProcess] = useState([])
  const [loading, setLoading] = useState(false)
  const [collapseActiveKey, setCollapseActiveKey] = useState(['1', '2', '3', '4', '5', '6']);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: async () => {

    },
    onAfterPrint: () => { },
  });
  //案件处差
  const columns_case = [
    { title: '产品', dataIndex: 'productName' },
    {
      title: '价格（元/瓶）',
      dataIndex: 'price',
      render: (text, record, index) => {
        return (<InputNumber disabled={disabled} value={text} style={{ width: '100%' }} onChange={e => {
          let p = handleForm.current.getFieldValue('counterfeitProductDetailVos');
          p[index].price = e
          handleForm.current.setFieldsValue({ counterfeitProductDetailVos: p, caseValue: p.reduce((count, { price, number }) => count + (price * number), 0) })
        }} />)
      }
    },
    { title: '数量（瓶）', dataIndex: 'number' },
  ]
  // 嫌疑人
  const [editableKeysSuspect, setEditableRowKeysSuspect] = useState([]);
  useEffect(() => {
    if (pageType == 'add') {
      getCounterfeit();
      return
    }
    getDetail()
  }, [])
  return (
    <Row>
      <Col span={24}>
        <Space>
          {isShowButton && (<Button loading={loading} onClick={temporarySave.bind(this, 1)} type='primary'>暂存</Button>)}
          {pageType != 'view' && (<Button loading={loading} onClick={temporarySave.bind(this, 2)} type='primary'>提交</Button>)}
          <Button type='primary'>查看流程图</Button>
          <Button type='primary' onClick={handlePrint}>打印</Button>
          <Button onClick={backPage} type='primary' danger>返回</Button>
        </Space>
      </Col>
      <Col ref={componentRef} style={{ marginTop: '20px' }} span={24}>
        <Collapse defaultActiveKey={collapseActiveKey} expandIconPosition='end'>
          <Panel header='管理信息' key='1'>
            <ProForm {...fromProps(manageForm)}>
              <ProFormText disabled={disabled} rules={[{ required: true }]} name='registrationName' label='标题' placeholder='请输入标题' />
              <ProFormText disabled name='registrationCode' label='表单号' />
              <ProFormText disabled name='createDate' label='发起时间' />
            </ProForm>
          </Panel>
          <Panel header='举报人信息' key='2'>
            <ProForm {...fromProps(reportFrom)}>
              <ProFormText disabled name='name' label='姓名' />
              <ProFormText disabled name='phone' label='手机号' />
              <ProFormText disabled name='caseAddress' label='案件地址' />
              <ProFormSelect
                disabled
                name='counterfeitType'
                label='案件类型'
                fieldProps={{ fieldNames: { label: 'counterfeit', value: 'counterfeitType' } }}
                request={() => counterfeit().then(res => res.data)}
              />
              <ProFormSelect
                disabled
                name='leadSource'
                label='线索来源'
                fieldProps={{ fieldNames: { label: 'infoName', value: 'infoType' } }}
                request={() => getInformationSources().then(res => res.data)}
              />
              <ProFormTextArea
                disabled
                fieldProps={{ autoSize: true }}
                name='feedbackExplain'
                label="案件描述"
              />
              <ProFormSelect
                name='majorCase'
                disabled={disabled}
                rules={[{ required: true }]}
                label='是否大案要案'
                request={() => BooleanEnums}
              />
            </ProForm>
          </Panel>
          <Panel header='登记信息' key='3'>
            <ProForm {...fromProps(registerForm)}>
              <ProFormText disabled name='registrationDate' label='登记时间' />
              <ProFormText disabled name='counterfeitCode' label='案件编号' />
              <ProFormSelect
                disabled
                name='regionCode'
                fieldProps={{ options: region }}
                label='秩序部事业部'
              />
              <ProFormSelect
                disabled
                name='processResult'
                fieldProps={{ options: process }}
                label='执法单位类型'
              />
              <Col span={24}>
                <Row>
                  <ProFormText
                    disabled={disabled}
                    rules={[{ required: true }]}
                    name='enforcementName'
                    label='执法单位具体名称'
                  />
                  <ProFormText
                    disabled={disabled}
                    rules={[{ required: true }]}
                    name='enforcementPerson'
                    label='执法单位联系人'
                  />
                  <ProFormText
                    disabled={disabled}
                    rules={[{ required: true }]}
                    name='enforcementPhone'
                    label='执法单位电话'
                  />
                </Row>
              </Col>
              <ProFormText hidden name='counterfeitId' label='案件id' />
            </ProForm>
          </Panel>
          <Panel header='案件处理信息' key='4'>
            <ProForm {...fromProps(handleForm)}>
              <ProFormSelect
                name='prosecution'
                disabled={disabled}
                rules={[{ required: true }]}
                request={() => BooleanEnums}
                label='是否起诉'
              />
              <ProFormDigit
                name='bottles'
                min={0}
                disabled={disabled}
                fieldProps={{ addonAfter: '瓶' }}
                rules={[{ required: true }]}
                label='其他厂家白酒瓶数'
              />
              <ProFormTextArea
                name='otherManufacturers'
                disabled={disabled}
                rules={[{ required: true }]}
                fieldProps={{ autoSize: true }}
                label='其他厂家白酒明细'
              />
              <Col span={16}>
                <Form.Item wrapperCol={{ span: 17 }} labelCol={{ span: 3 }} name='counterfeitProductDetailVos' label="涉案产品">
                  <RenderTable />
                </Form.Item>
              </Col>
              <ProFormDigit name='caseValue' hidden label='案值' />
            </ProForm>
          </Panel>
          <Panel header='涉案人员信息' key='5'>
            <ProForm validateTrigger="onBlur" submitter={false} formRef={involvedForm}>
              <EditableProTable
                name='counterfeitPersonsInvolvedVos'
                rowKey='key'
                toolBarRender={false}
                columns={columns_suspect}
                recordCreatorProps={ disabled ? false : {
                  newRecordType: 'dataSource',
                  record: () => ({ key: Date.now() }),
                }}
                scroll={{ x: columns_suspect.reduce((m, n) => (m + n.width), 0) }}
                editable={{
                  type: 'multiple',
                  editableKeys: editableKeysSuspect,
                  onChange: setEditableRowKeysSuspect,
                  actionRender: (row, _, dom) => [dom.delete]
                }}
              />
            </ProForm>
          </Panel>
          <Panel header='案件跟进信息' key='6'>
            <CaseProgress disabled={disabled} ref={progressForm}></CaseProgress>
          </Panel>
        </Collapse>
      </Col>
    </Row>
  );
  //查看详情
  async function getDetail() {
    try {
      let { data } = await getDetailById(params.id);
      setIsShowButton(data.status === 1)
      setRegion([{ label: data.regionName, value: data.regionCode }])
      setProcess([{ label: data.processResultName, value: data.processResult }])
      manageForm.current.setFieldsValue(data)
      reportFrom.current.setFieldsValue(data)
      registerForm.current.setFieldsValue(data)
      if (data.counterfeitInvestigationVo) {
        data.counterfeitInvestigationVo.counterfeitProductDetailVos =
          (Array.isArray(data.counterfeitInvestigationVo.counterfeitProductDetailVos) ? data.counterfeitInvestigationVo.counterfeitProductDetailVos.map(v => ({
            ...v,
            key: v.id,
          })) : [])
        handleForm.current.setFieldsValue(data.counterfeitInvestigationVo)
      }
      data.counterfeitPersonsInvolvedVos = (Array.isArray(data.counterfeitPersonsInvolvedVos) ? data.counterfeitPersonsInvolvedVos.map(v => ({
        ...v,
        birth: v.birth ? moment(v.birth) : null,
        nativePlace: v.nativePlace.split('-'),
        key: v.id
      })) : [])
      if (pageType == 'edit') setEditableRowKeysSuspect(data.counterfeitPersonsInvolvedVos.map(v => v.key))
      involvedForm.current.setFieldsValue(data)
      if (data.followUpInformationVo) {
        data.followUpInformationVo.counterfeitCaseHandlingVos =
          (Array.isArray(data.followUpInformationVo.counterfeitCaseHandlingVos) ? data.followUpInformationVo.counterfeitCaseHandlingVos.map(v => ({
            ...v,
            term: v.term ? moment(v.term) : null,
            key: v.id,
          })) : [])
        progressForm.current.setFieldsValue({
          ...data.followUpInformationVo,
          closingTime: data.followUpInformationVo.closingTime ? moment(data.followUpInformationVo.closingTime) : null,
          prosecutionTime: data.followUpInformationVo.prosecutionTime ? moment(data.followUpInformationVo.prosecutionTime) : null
        });
        if (pageType == 'edit') progressForm.current.setEditableRowKeys(data.followUpInformationVo.counterfeitCaseHandlingVos.map(v => v.key))
      }
    } catch (err) { }
  }
  // 暂存/提交
  async function temporarySave(status) {
    let manageFormData = await manageForm.current.validateFields();
    let reportFormData = await reportFrom.current.validateFields();
    let registerFormData = await registerForm.current.validateFields();
    let handleFormData = await handleForm.current.validateFields();
    let involvedFormData = await involvedForm.current.validateFields();
    if (!involvedFormData.counterfeitPersonsInvolvedVos || !involvedFormData.counterfeitPersonsInvolvedVos.length) {
      return message.error('请添加涉案人员信息')
    }
    involvedFormData.counterfeitPersonsInvolvedVos = involvedFormData.counterfeitPersonsInvolvedVos.map(v => ({
      ...v,
      nativePlace: `${v.nativePlace[0]}-${v.nativePlace[1]}-${v.nativePlace[2]}`,
      birth: v.birth ? v.birth.format('YYYY-MM-DD') : v.birth
    }))
    let progressFormData = await progressForm.current.validateFields();
    if (progressFormData.closingTime) progressFormData.closingTime = progressFormData.closingTime.format('YYYY-MM-DD');
    if (progressFormData.prosecutionTime) progressFormData.prosecutionTime = progressFormData.prosecutionTime.format('YYYY-MM-DD');
    progressFormData.counterfeitCaseHandlingVos = progressFormData.counterfeitCaseHandlingVos.map(v => ({
      ...v,
      term: v.term ? v.term.format('YYYY-MM-DD') : v.term
    }))
    let body = Object.assign(
      {
        status,
        regionName: registerFormData.regionCode ? region[0].label : null,
        processResultName: registerFormData.processResult ? process[0].label : null,
      },
      manageFormData,
      reportFormData,
      registerFormData,
      { counterfeitInvestigationVo: handleFormData },
      involvedFormData,
      { followUpInformationVo: progressFormData }
    )
    if (pageType != 'add') { body.id = params.id }
    try {
      setLoading(true);
      let res = await saveOrpdateFun(body, pageType == 'add' ? 'save' : 'updateForm');
      setLoading(false);
      if (res.code == '00000') {
        if (pageType == 'add') {
          openPage({
            pathname: '/counterfeitingReport/reportlist',
            name: '假冒侵权侵权登记列表'
          }, true)
          return
        }
        backPage(true)
      }
    } catch (err) {
      setLoading(false);
    }
  }
  //假冒侵权详情
  async function getCounterfeit() {
    try {
      let { data: { consumerCounterfeitVO, consumerCounterfeitForensicsVO } } = await counterfeitingDetails(params.id);
      setRegion([{ label: consumerCounterfeitForensicsVO.regionName, value: consumerCounterfeitForensicsVO.regionCode }])
      setProcess([{ label: consumerCounterfeitForensicsVO.processResultName, value: consumerCounterfeitForensicsVO.processResult }])
      reportFrom.current.setFieldsValue({
        name: consumerCounterfeitVO.name,
        phone: consumerCounterfeitVO.phone,
        caseAddress: consumerCounterfeitVO.terminalAddress,
        counterfeitType: consumerCounterfeitVO.counterfeitType,
        leadSource: consumerCounterfeitForensicsVO.leadSource,
        feedbackExplain: consumerCounterfeitVO.remark
      })
      registerForm.current.setFieldsValue({
        registrationDate: consumerCounterfeitForensicsVO.createDate,
        counterfeitCode: consumerCounterfeitVO.counterfeitCode,
        counterfeitId: consumerCounterfeitVO.id,
        regionCode: consumerCounterfeitForensicsVO.regionCode,
        processResult: consumerCounterfeitForensicsVO.processResult
      })
      const { productVos, terminalProvinceCode, terminalCityCode } = consumerCounterfeitForensicsVO
      let p = await getProductVosPrice(productVos, terminalProvinceCode, terminalCityCode);
      handleForm.current.setFieldsValue({ counterfeitProductDetailVos: p, caseValue: p.reduce((count, { price, number }) => count + (price * number), 0) })
    } catch (err) { }
  }
  // 根据取证的产品查询价格
  async function getProductVosPrice(VOS, pCode, cCode) {
    if (!Array.isArray(VOS)) return []
    try {
      let { data } = await getProductPrice({
        current: 1,
        size: 100,
        productCodes: VOS.map(v => v.productCode),
        provinceCode: pCode,
        cityCode: cCode
      })
      const productVos = VOS.map(v => {
        let item = data.find(m => v.productCode == m.productCode);
        return {
          number: v.quantityType == 1 ? v.quantity : (v.quantity * (item ? (item.unit || 12) : 12)),
          price: item ? item.basePrice : 0,
          productCode: v.productCode,
          productName: v.productName,
          key: v.id
        }
      })
      return productVos
    } catch (err) { }
  }
  function RenderTable({ value }) {
    return (
      <Table
        size='small'
        bordered
        columns={columns_case}
        scroll={{ y: 300 }}
        dataSource={value || []}
        pagination={false}
        rowKey='key'
        summary={(pageData) => {
          return (<Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>案值（总计）</Table.Summary.Cell>
              <Table.Summary.Cell index={1} colSpan={2} align='center'>
                {pageData.reduce((count, { price, number }) => count + (price * number), 0)}元
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>)
        }}
      />
    )
  }
}
export default reportForm;