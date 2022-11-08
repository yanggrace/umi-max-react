import React, {useState, useEffect} from 'react';
import {Modal, Button, Form, Row, Col, Typography, Divider, Image, Input, Select, message} from 'antd';
import {ProTable} from '@ant-design/pro-components';
import {getCommentList, saveEvaluation} from '@/services/common';
import {Container} from '@/utils';
import {SUCCESS_CODE} from '@/constants';
import {getParams, backPage} from '@/utils/windowLayout';

const {Text} = Typography;
const {TextArea} = Input;
const {Option} = Select;

export default () => {
  const [formRef] = Form.useForm();
  const [commentParams, setCommentParams] = useState({});
  const [selectOption, setSelectOption] = useState([]);
  const [params, setParams] = useState(getParams().state);
  const [saveLoading, setSaveLoading] = useState(false);

  const columns = [
    {title: '序号', dataIndex: 'index', valueType: 'index', width: 48, fixed: 'left'},
    {title: '产品编码', dataIndex: 'productCode', search: false, width: 100},
    {title: '产品名称', dataIndex: 'productName', search: false, width: 150},
    {title: '数量', dataIndex: 'quantity', search: false, width: 100},
    {title: '单位', dataIndex: 'quantityTypeName', search: false, width: 100},
  ];

  const infoColumns = [
    {title: '序号', dataIndex: 'index', valueType: 'index', width: 48, fixed: 'left'},
    {title: '产品编码', dataIndex: 'productCode', search: false, width: 100},
    {title: '产品名称', dataIndex: 'productName', search: false, width: 150},
    {title: '数量', dataIndex: 'quantity', search: false, width: 100},
    {title: '单位', dataIndex: 'quantityTypeName', search: false, width: 100},
    {
      title: '是否假冒侵权',
      dataIndex: 'isCounterfeitProduct',
      search: false,
      width: 100,
      render: (text, record) => <span>{record.isCounterfeitProduct ? '是' : '否'}</span>,
    },
  ];

  const commentColumns = [
    {title: '序号', dataIndex: 'index', valueType: 'index', width: 48, fixed: 'left'},
    {title: '预处理人员', dataIndex: 'fullName', search: false, width: 100},
    {title: '预处理时间', dataIndex: 'processDate', search: false, width: 100},
    {title: '预处理意见', dataIndex: 'preprocessComments', search: false},
  ];

  useEffect(() => {
    initSelect();
  }, []);

  // 初始化满意度的下拉框
  const initSelect = async () => {
    let {code, data} = await getCommentList();
    if (code === SUCCESS_CODE) {
      setSelectOption(data);
    }
  };

  // 保存详情
  const onSave = async () => {
    setSaveLoading(true);
    let {code} = await saveEvaluation({
      ...commentParams,
      businessCode: params.records[0].counterfeitCode,
    });
    setSaveLoading(false);
    if (code === SUCCESS_CODE) {
      backPage(true);
      message.success('操作成功');
    }
  };

  return (
    <Form labelCol={{span: 8}} wrapperCol={{span: 16}} name="formRef" form={formRef} style={{backgroundColor: '#fff'}}>
      <Divider style={{fontSize: '20px'}}>线索信息</Divider>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="提报人" name="name">
            <Text>{params.detailsData.consumerCounterfeitVO.name || '无'}</Text>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="提报人电话" name="phone">
            <Text>{params.detailsData.consumerCounterfeitVO.phone || '无'}</Text>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="提报时间" name="date">
            <Text>{params.detailsData.consumerCounterfeitVO.createDate || '无'}</Text>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="类型" name="counterfeitTypeName">
            <Text>{params.detailsData.consumerCounterfeitVO.counterfeitTypeName || '无'}</Text>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="门店名称" name="terminalName">
            <Text>{params.detailsData.consumerCounterfeitVO.terminalName || '无'}</Text>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="发现地址" name="terminalAddress">
            <Text>{params.detailsData.consumerCounterfeitVO.terminalAddress || '无'}</Text>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="仓库地址" name="warehouseAddress">
            <Text>{params.detailsData.consumerCounterfeitVO.warehouseAddress || '无'}</Text>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="提交地址" name="locationAddress">
            <Text>{params.detailsData.consumerCounterfeitVO.locationAddress || '无'}</Text>
          </Form.Item>
        </Col>
      </Row>
      <ProTable
        search={false}
        headerTitle="产品信息"
        columns={columns}
        rowKey="id"
        bordered
        style={{width: '95%', margin: '0 auto', maxHeight: '400px', overflowY: 'auto'}}
        revalidateOnFocus={false}
        pagination={false}
        toolBarRender={false}
        dataSource={params.detailsData.consumerCounterfeitVO?.consumerCounterfeitProductVOS || []}
      />
      <Row gutter={24} style={{marginTop: '12px'}}>
        <Col span={8}>
          <Form.Item label="门头照" name="img">
            <div style={{display: 'flex'}}>
              {params.detailsData.consumerCounterfeitVO?.doorPhoto?.length
                ? params.detailsData.consumerCounterfeitVO?.doorPhoto.map((item, index) => {
                    return (
                      <div style={index === 0 ? {} : {marginLeft: '4px'}}>
                        <Image
                          key={`${item.url}${index}`}
                          width={40}
                          height={40}
                          src={item.url}
                          preview={{getContainer: Container}}
                        />
                      </div>
                    );
                  })
                : '无'}
            </div>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="物流园区" name="area">
            <div style={{display: 'flex'}}>
              {params.detailsData.consumerCounterfeitVO?.parkPhoto?.length
                ? params.detailsData.consumerCounterfeitVO?.parkPhoto.map((item, index) => {
                    return (
                      <div style={index === 0 ? {} : {marginLeft: '4px'}}>
                        <Image
                          key={`${item.url}${index}`}
                          width={40}
                          height={40}
                          src={item.url}
                          preview={{getContainer: Container}}
                        />
                      </div>
                    );
                  })
                : '无'}
            </div>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="物流现场" name="scenePhotos">
            <div style={{display: 'flex'}}>
              {params.detailsData.consumerCounterfeitVO?.scenePhotos?.length
                ? params.detailsData.consumerCounterfeitVO?.scenePhotos.map((item, index) => {
                    return (
                      <div style={index === 0 ? {} : {marginLeft: '4px'}}>
                        <Image
                          key={`${item.url}${index}`}
                          width={40}
                          height={40}
                          src={item.url}
                          preview={{getContainer: Container}}
                        />
                      </div>
                    );
                  })
                : '无'}
            </div>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="其它" name="others">
            <div style={{display: 'flex'}}>
              {params.detailsData.consumerCounterfeitVO?.otherPhotos?.length
                ? params.detailsData.consumerCounterfeitVO?.otherPhotos.map((item, index) => {
                    return (
                      <div style={index === 0 ? {} : {marginLeft: '4px'}}>
                        <Image
                          key={`${item.url}${index}`}
                          width={40}
                          height={40}
                          src={item.url}
                          preview={{getContainer: Container}}
                        />
                      </div>
                    );
                  })
                : '无'}
            </div>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={16}>
          <Form.Item label="说明" name="remark" labelCol={{span: 4}} wrapperCol={{span: 20}}>
            <TextArea
              defaultValue={params.detailsData.consumerCounterfeitVO.remark}
              disabled={true}
              rows={3}
              placeholder="请输入说明"
            />
          </Form.Item>
        </Col>
      </Row>

      <Divider style={{fontSize: '20px'}}>核查信息</Divider>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="秩序专员" name="consumerPersonClueVOS">
            <Text>{params.detailsData?.consumerPersonClueVOS || '无'}</Text>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="监管中心负责人" name="consumerPersonClueVOList">
            <Text>{params.detailsData?.consumerPersonClueVOList || '无'}</Text>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="实际核查人" name="createName">
            <Text>{params.detailsData.consumerCounterfeitForensicsVO?.createName || '无'}</Text>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="处理结果" name="processResultName">
            <Text>{params.detailsData.consumerCounterfeitForensicsVO?.processResultName || '无'}</Text>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="核查地址" name="terminalAddress">
            <Text>{params.detailsData.consumerCounterfeitForensicsVO?.terminalAddress || '无'}</Text>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="省市区" name="address">
            <Text>
              {params.detailsData.consumerCounterfeitForensicsVO?.terminalProvinceName +
                params.detailsData.consumerCounterfeitForensicsVO?.terminalCityName +
                params.detailsData.consumerCounterfeitForensicsVO?.terminalAreaName || '无'}
            </Text>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="处理时间" name="createDate">
            <Text>{params.detailsData.consumerCounterfeitForensicsVO?.createDate || '无'}</Text>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="线索来源" name="leadSourceName">
            <Text>{params.detailsData.consumerCounterfeitForensicsVO?.leadSourceName || '无'}</Text>
          </Form.Item>
        </Col>
      </Row>

      <ProTable
        search={false}
        headerTitle="产品信息"
        columns={infoColumns}
        rowKey="id"
        bordered
        style={{width: '95%', margin: '0 auto', maxHeight: '400px', overflowY: 'auto'}}
        revalidateOnFocus={false}
        pagination={false}
        toolBarRender={false}
        dataSource={params.detailsData.consumerCounterfeitForensicsVO?.productVos || []}
      />

      <Row gutter={24} style={{marginTop: '12px'}}>
        <Col span={16}>
          <Form.Item label="照片上传" name="photos" labelCol={{span: 4}} wrapperCol={{span: 20}}>
            <div style={{display: 'flex'}}>
              {params.detailsData.consumerCounterfeitForensicsVO?.photos?.length
                ? params.detailsData.consumerCounterfeitForensicsVO?.photos.map((item, index) => {
                    return (
                      <div style={index === 0 ? {} : {marginLeft: '4px'}}>
                        <Image
                          key={`${item.url}${index}`}
                          width={40}
                          height={40}
                          src={item.url}
                          preview={{getContainer: Container}}
                        />
                      </div>
                    );
                  })
                : '无'}
            </div>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={16}>
          <Form.Item label="反馈说明" name="feedbackExplain" labelCol={{span: 4}} wrapperCol={{span: 20}}>
            <TextArea
              defaultValue={params.detailsData.consumerCounterfeitForensicsVO?.feedbackExplain}
              disabled={true}
              rows={3}
              placeholder="请输入说明"
            />
          </Form.Item>
        </Col>
      </Row>
      <Divider style={{fontSize: '20px'}}>预处理意见</Divider>
      <ProTable
        search={false}
        headerTitle=""
        columns={commentColumns}
        rowKey="id"
        bordered
        style={{width: '95%', margin: '0 auto', maxHeight: '400px', overflowY: 'auto'}}
        revalidateOnFocus={false}
        pagination={false}
        toolBarRender={false}
        dataSource={params.detailsData.consumerCommentsVOList || []}
      />

      <Divider style={{fontSize: '20px'}}>过程评价</Divider>
      {!params.detailsData.processEvaluationVo.yesOrNo ? (
        <>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="回访人" name="returnVisitor">
                <Text>{params.detailsData.processEvaluationVo.createName || '无'}</Text>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="评价时间" name="evaluationTime">
                <Text>{params.detailsData.processEvaluationVo.evaluationTime || '无'}</Text>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={16}>
              <Form.Item label="回访结果" name="returnVisitResults" labelCol={{span: 4}} wrapperCol={{span: 20}}>
                <Text>{params.detailsData.processEvaluationVo.returnVisitResults || '无'}</Text>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="回访满意度" name="satisfactionName">
                <Text>{params.detailsData.processEvaluationVo.satisfactionName || '无'}</Text>
              </Form.Item>
            </Col>

            <Col span={10}>
              <Form.Item label="处理人员服务态度" name="serviceAttitudeName">
                <Text>{params.detailsData.processEvaluationVo.serviceAttitudeName || '无'}</Text>
              </Form.Item>
            </Col>
          </Row>
        </>
      ) : (
        <>
          <Row gutter={24}>
            <Col span={16}>
              <Form.Item label="回访结果" name="returnVisitResults" labelCol={{span: 4}} wrapperCol={{span: 20}}>
                <TextArea
                  onChange={(e) => {
                    console.log(e);
                    setCommentParams({
                      ...commentParams,
                      returnVisitResults: e.target.value,
                    });
                  }}
                  rows={4}
                  placeholder="请输入回访结果"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label="回访满意度" name="satisfaction">
                <Select
                  style={{
                    width: '100%',
                  }}
                  placeholder="请选择回访满意度"
                  onChange={(e) => {
                    setCommentParams({
                      ...commentParams,
                      satisfaction: e,
                    });
                  }}
                >
                  {selectOption.map((d) => (
                    <Option key={d.code}>{d.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={10}>
              <Form.Item label="处理人员服务态度" name="serviceAttitude">
                <Select
                  style={{
                    width: '100%',
                  }}
                  placeholder="请选择处理人员服务态度"
                  onChange={(e) => {
                    setCommentParams({
                      ...commentParams,
                      serviceAttitude: e,
                    });
                  }}
                >
                  {selectOption.map((d) => (
                    <Option key={d.code}>{d.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </>
      )}

      <div style={{display: 'flex', justifyContent: 'flex-end', paddingBottom: '24px', paddingRight: '24px'}}>
        <Button
          size="middle"
          onClick={() => {
            backPage(true);
          }}
        >
          取消
        </Button>
        {params.detailsData.processEvaluationVo.yesOrNo && (
          <Button
            loading={saveLoading}
            style={{marginLeft: '24px'}}
            type="primary"
            size="middle"
            onClick={() => {
              onSave();
            }}
          >
            保存
          </Button>
        )}
      </div>
    </Form>
  );
};
