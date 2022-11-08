import React, {useState, useEffect} from 'react';
import {Modal, Form, Row, Col, Select} from 'antd';
import {ProTable} from '@ant-design/pro-components';
import {Container, handleRes} from '@/utils';
import {getSuperUsers, getAllArea, saveTransfer} from '@/services/common';
import {cloneDeep} from 'lodash';
import styles from './index.less';
import {SUCCESS_CODE} from '@/constants';
const {Option} = Select;

export default ({visible, setVisible, records, actionRef, type}) => {
  const [areaOption, setAreaOption] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选择的值id
  const [selectedRow, setSelectedRow] = useState([]); // 选择的值record
  const [confirmLoading, setConfirmLoading] = useState(false);
  const columns = [
    {title: '序号', dataIndex: 'index', valueType: 'index', width: 48, fixed: 'left'},
    {title: '取证人姓名', dataIndex: 'fullName', search: false, width: 100},
    {title: '岗位', dataIndex: 'positionName', search: false, width: 150},
    {title: '取证人工号', dataIndex: 'userName', search: false, width: 100},
  ];

  useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    let {code, data} = await getAllArea();
    if (code === SUCCESS_CODE) {
      setAreaOption(data);
    }
  };

  const getList = async (e) => {
    let {code, data} = await getSuperUsers({regionCode: e});
    if (code === SUCCESS_CODE) {
      setTableData(data);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (rowskey, selectedRows) => {
      setSelectedRowKeys(rowskey);
      setSelectedRow(selectedRows);
    },
  };

  // 确定分发
  const onSave = async () => {
    console.log('records', records);
    let ids = records.map((item) => item.id);
    setConfirmLoading(true);
    let res = await saveTransfer({
      businessIds: ids,
      businessType: type,
      person: cloneDeep(selectedRow),
    });
    setConfirmLoading(false);
    let flag = handleRes(res, actionRef);
    if (flag) {
      setVisible(false);
    }
  };
  return (
    <Modal
      width={800}
      title="分发"
      visible={visible}
      destroyOnClose
      getContainer={Container}
      confirmLoading={confirmLoading}
      onCancel={() => {
        setVisible(false);
      }}
      onOk={onSave}
    >
      <Form name="addForm" labelWrap>
        <Form.Item label="事业部" name="categoryData" rules={[{required: true, message: '请选择事业部'}]}>
          <Select
            allowClear
            showSearch
            placeholder="请选择事业部"
            optionFilterProp="children"
            defaultActiveFirstOption={false}
            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
            onChange={(e) => {
              getList(e);
            }}
          >
            {areaOption.map((d) => (
              <Option key={d.areaId}>{d.areaName}</Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      <ProTable
        search={false}
        toolBarRender={false}
        columns={columns}
        rowKey="userName"
        revalidateOnFocus={false}
        pagination={false}
        dataSource={tableData}
        rowSelection={rowSelection}
      />
    </Modal>
  );
};
