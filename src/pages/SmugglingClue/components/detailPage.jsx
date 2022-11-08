import React, {useState, useEffect} from 'react';
import {Form, Row, Col, Typography, Divider, Image, Input, Select, Button, message} from 'antd';
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
    {title: '当前价格', dataIndex: 'price', search: false, width: 150},
    {title: '购买瓶数', dataIndex: 'quantity', search: false, width: 100},
  ];

  const infoColumns = [
    {title: '序号', dataIndex: 'index', valueType: 'index', width: 48, fixed: 'left'},
    {title: '产品编码', dataIndex: 'productCode', search: false, width: 100},
    {title: '产品名称', dataIndex: 'productName', search: false, width: 150},
    {title: '箱码', dataIndex: 'boxCode', search: false, width: 100},
    {title: '瓶码', dataIndex: 'botCode', search: false, width: 100},
    {title: '购买瓶数', dataIndex: 'quantity', search: false, width: 100},
    {title: '单瓶价格', dataIndex: 'singlePrice', search: false, width: 100},
    {title: '当地价格', dataIndex: 'localPrice', search: false, width: 100},
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
      businessCode: params.records[0].fleeingCode,
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
            <Text>{params.detailsData.consumerFleeingGoodsVO.name || '无'}</Text>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="提报人电话" name="phone">
            <Text>{params.detailsData.consumerFleeingGoodsVO.phone || '无'}</Text>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="提报时间" name="date">
            <Text>{params.detailsData.consumerFleeingGoodsVO.createDate || '无'}</Text>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="门店名称" name="terminalName">
            <Text>{params.detailsData.consumerFleeingGoodsVO.terminalName || '无'}</Text>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="发现地址" name="terminalAddress">
            <Text>{params.detailsData.consumerFleeingGoodsVO.terminalAddress || '无'}</Text>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="提交地址" name="locationAddress">
            <Text>{params.detailsData.consumerFleeingGoodsVO.locationAddress || '无'}</Text>
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
        dataSource={params.detailsData.consumerFleeingGoodsVO.fleeingProductVOS}
      />

      <Row gutter={24} style={{marginTop: '12px'}}>
        <Col span={8}>
          <Form.Item label="门头照" name="doorPhoto">
            <div style={{display: 'flex'}}>
              {params.detailsData.consumerFleeingGoodsVO?.doorPhoto?.length
                ? params.detailsData.consumerFleeingGoodsVO?.doorPhoto.map((item, index) => {
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
          <Form.Item label="滚章信息" name="rollSealPhotos">
            <div style={{display: 'flex'}}>
              {params.detailsData.consumerFleeingGoodsVO?.rollSealPhotos?.length
                ? params.detailsData.consumerFleeingGoodsVO?.rollSealPhotos.map((item, index) => {
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
          <Form.Item label="其他" name="otherPhotos">
            <div style={{display: 'flex'}}>
              {params.detailsData.consumerFleeingGoodsVO?.otherPhotos?.length
                ? params.detailsData.consumerFleeingGoodsVO?.otherPhotos.map((item, index) => {
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
              defaultValue={params.detailsData.consumerFleeingGoodsVO.remark}
              disabled={true}
              rows={3}
              placeholder="请输入说明"
            />
          </Form.Item>
        </Col>
      </Row>

      <Divider style={{fontSize: '20px'}}>取证信息</Divider>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="秩序专员" name="orderCommissioner">
            <Text>{params.detailsData?.orderCommissioner || '无'}</Text>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="分发人" name="salesman">
            <Text>{params.detailsData?.salesman || '无'}</Text>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="监管中心负责人" name="supervisionCenter">
            <Text>{params.detailsData?.supervisionCenter || '无'}</Text>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="实际取证人" name="createName">
            <Text>{params.detailsData.consumerFleeingGoodsForensicsVO?.createName || '无'}</Text>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="取证地址" name="terminalAddress">
            <Text>{params.detailsData.consumerFleeingGoodsForensicsVO?.terminalAddress || '无'}</Text>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="省市区" name="address">
            <Text>
              {params.detailsData.consumerFleeingGoodsForensicsVO?.terminalProvinceName +
                params.detailsData.consumerFleeingGoodsForensicsVO?.terminalCityName +
                params.detailsData.consumerFleeingGoodsForensicsVO?.terminalAreaName || '无'}
            </Text>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="线索来源" name="classifiedName">
            <Text>{params.detailsData.consumerFleeingGoodsForensicsVO?.classifiedName || '无'}</Text>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="处理时间" name="createDate">
            <Text>{params.detailsData.consumerFleeingGoodsForensicsVO?.createDate || '无'}</Text>
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
        dataSource={params.detailsData.consumerFleeingGoodsForensicsVO?.fleeingGoodsForensicsInfo || []}
      />

      <Row gutter={24} style={{marginTop: '12px'}}>
        <Col span={8}>
          <Form.Item label="门头照" name="doorPhoto">
            <div style={{display: 'flex'}}>
              {params.detailsData.consumerFleeingGoodsForensicsVO?.doorPhoto?.length
                ? params.detailsData.consumerFleeingGoodsForensicsVO?.doorPhoto.map((item, index) => {
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
          <Form.Item label="发票" name="invoicePhoto">
            <div style={{display: 'flex'}}>
              {params.detailsData.consumerFleeingGoodsForensicsVO?.invoicePhoto?.length
                ? params.detailsData.consumerFleeingGoodsForensicsVO?.invoicePhoto.map((item, index) => {
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
          <Form.Item label="收货产品照" name="incomingProductPhoto">
            <div style={{display: 'flex'}}>
              {params.detailsData.consumerFleeingGoodsForensicsVO?.incomingProductPhoto?.length
                ? params.detailsData.consumerFleeingGoodsForensicsVO?.incomingProductPhoto.map((item, index) => {
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
          <Form.Item label="箱子照片" name="boxPhoto">
            <div style={{display: 'flex'}}>
              {params.detailsData.consumerFleeingGoodsForensicsVO?.boxPhoto?.length
                ? params.detailsData.consumerFleeingGoodsForensicsVO?.boxPhoto.map((item, index) => {
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
          <Form.Item label="其他" name="otherPhotos">
            <div style={{display: 'flex'}}>
              {params.detailsData.consumerFleeingGoodsForensicsVO?.otherPhotos?.length
                ? params.detailsData.consumerFleeingGoodsForensicsVO?.otherPhotos.map((item, index) => {
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
          <Form.Item label="反馈说明" name="feedback" labelCol={{span: 4}} wrapperCol={{span: 20}}>
            <TextArea
              defaultValue={params.detailsData.consumerFleeingGoodsForensicsVO?.feedback}
              disabled={true}
              rows={3}
              placeholder="请输入说明"
            />
          </Form.Item>
        </Col>
      </Row>

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
            style={{marginLeft: '24px'}}
            type="primary"
            size="middle"
            loading={saveLoading}
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
