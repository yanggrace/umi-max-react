/*
 * @Author: wangrui
 * @Date: 2022-08-31 15:40:35
 * @LastEditors: wangrui
 * @Description:
 * @LastEditTime: 2022-09-01 11:11:53
 */
import { Button, Modal, Table, Upload, message, Tabs, Statistic } from 'antd';
import { useState } from 'react';

const defaultConfig = {
  bottomText: '导入',
  modalTitle: '导入',
  width: '60vw',
  accept: '.xlsx',
};
/**
 *
 * @param {*必填} column
 * @param {*必填 上传url} url
 * @param {*可选 点击按钮回调} callback
 * @param {*可选 按钮文字配置} config
 * @returns
 */
function ImportFileBottom({ errColumn = [], okColumn = [], url = `/api/oims/special/product/config/excel/import`, callback, config = {} }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [successList, setSuccessList] = useState([]); // 列表数据
  const [errorList, setErrorList] = useState([]); // 列表数据
  const [disabled, setDisabled] = useState(false);
  const configData = { ...defaultConfig, ...config };
  return (
    <>
      <Button type='primary' onClick={() => setModalVisible(true)}>
        {configData.bottomText}
      </Button>
      <Modal
        title={configData.modalTitle}
        visible={modalVisible}
        onCancel={hideModal}
        footer={[
          <Button type='primary' key='back' onClick={hideModal}>
            关闭
          </Button>,
        ]}
        width={configData.width}
      >
        <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Upload
            name='file'
            disabled={disabled}
            accept={configData.accept}
            fileList={fileList}
            onChange={handleChange}
            headers={{ Authorization: `Bearer ${localStorage.getItem('access_token')}` }}
            action={url}
          >
            <Button type='primary' disabled={disabled}>
              导入
            </Button>
          </Upload>
          ,
          <div style={{ display: 'flex', alignItem: 'center' }}>
            <Statistic
              valueStyle={{ color: '#1890ff' }}
              suffix="条"
              title={<span style={{ fontSize: '15px', color: '#1890ff' }}>导入成功</span>}
              value={successList.length}
            />
            <Statistic
              valueStyle={{ color: '#cf1322' }}
              style={{ marginLeft: '20px' }}
              suffix="条"
              title={<span style={{ fontSize: '15px', color: '#cf1322' }}>导入失败</span>}
              value={errorList.length}
            />
          </div>
        </div>
        <Tabs size='small' defaultActiveKey='1'>
          <Tabs.TabPane tab="导入成功" key="1">
            <Table
              size='small'
              columns={okColumn}
              loading={modalLoading}
              dataSource={successList}
              pagination={{
                showSizeChanger: true,
                defaultPageSize: 10,
                hideOnSinglePage: false,
                total: successList.length,
                pageSizeOptions: [5, 10, 20, 50, 100],
              }}
              rowKey='rowNum'
              scroll={{ x: 'max-content' }}
              bodyStyle={{
                padding: 0,
                background: '#f0f2f5',
              }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="导入失败" key="2">
            <Table
              size='small'
              pagination={{
                showSizeChanger: true,
                defaultPageSize: 10,
                total: errorList.length,
                hideOnSinglePage: false,
                pageSizeOptions: [5, 10, 20, 50, 100],
              }}
              columns={errColumn}
              loading={modalLoading}
              dataSource={errorList}
              rowKey='rowNum'
              scroll={{ x: 'max-content' }}
              bodyStyle={{
                padding: 0,
                background: '#f0f2f5',
              }}
            />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
    </>
  );
  // 隐藏弹窗
  function hideModal(modal) {
    setDisabled(false);
    setSuccessList([]);
    setErrorList([]);
    setModalVisible(false);
    if (callback) callback();
  }
  // 点击确认
  function handleSubmit() {
    setModalVisible(false);
  }
  // 上传按钮点击
  function handleChange(info) {
    setModalLoading(true);
    setFileList(info.fileList);

    if (['done', 'removed'].some((item) => item == info.file.status)) {
      setDisabled(true);
      console.log(info, '================================================');
      const { response } = info.file;

      setFileList([]);
      if (response.code == '00000') {
        const { errorList, successList } = response.data;
        setSuccessList(successList);
        setErrorList(errorList);
      } else {
        message.error(response.message || '导入失败');
      }
    }
    setModalLoading(false);
  }
}
export default ImportFileBottom;
