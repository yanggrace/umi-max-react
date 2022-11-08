/*
 * @Author: wangrui
 * @Date: 2022-09-15 14:05:57
 * @LastEditors: wangrui
 * @Description:
 * @LastEditTime: 2022-09-22 09:07:19
 */
import React, { useState } from 'react';
import { Modal, message } from 'antd';
import { ProTable } from '@ant-design/pro-components';
import { getForensicProducts, checkProductCode } from '../service';
import { Container } from '@/utils';
import { SUCCESS_CODE } from '@/constants';
import { openPage } from '@/utils/windowLayout';

export default ({ visible, setVisible, records }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选择的值id
  const [selectRow, setSelectedRow] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const columns = [
    { title: '序号', dataIndex: 'index', valueType: 'index', width: 48, fixed: 'left' },
    { title: '品牌', dataIndex: 'brandName', search: false, width: 100 },
    { title: '产品编码', dataIndex: 'productCode', search: false, width: 100 },
    { title: '产品名称', dataIndex: 'productName', search: false, width: 150 },
    { title: '搜索', dataIndex: 'param', hideInTable: true, search: true, width: 150 },
  ];

  const handleProTableRes = ({ code, data }) => {
    return {
      success: code === '00000',
      total: data.length,
      data: data || [],
    };
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (rowskey, selectedRows) => {
      setSelectedRowKeys(rowskey);
      setSelectedRow(selectedRows);
    },
  };

  const onSave = async () => {
    if (selectRow.length === 0) {
      message.info('至少选择一项产品');
      return;
    }
    setConfirmLoading(true);
    let { code } = await checkProductCode({ productCodes: selectRow.map((item) => item.productCode) });
    setConfirmLoading(false);
    if (code !== SUCCESS_CODE) {
      return;
    }
    let type = 2;
    let forensicsIds = records.map((item) => item.forensicsId);
    let productCodes = selectRow.map((item) => item.productCode);
    setVisible(false);
    openPage({
      pathname: `/processForm/feelForm/${records[0].id}`,
      state: {
        forensicsIds,
        productCodes,
        type,
      },
      name: '核查报告',
    });
  };
  return (
    <Modal width={800} title='查看' visible={visible} destroyOnClose getContainer={Container} confirmLoading={confirmLoading} onCancel={setVisible.bind(this, false)} onOk={onSave}>
      <ProTable
        headerTitle='提报详情'
        columns={columns}
        rowKey='id'
        revalidateOnFocus={false}
        toolBarRender={false}
        rowSelection={rowSelection}
        pagination={false}
        tableAlertRender={false}
        tableAlertOptionRender={false}
        request={async (params) => {
          return getForensicProducts({
            forensicsIds: records.map((item) => item.forensicsId),
            ids: records.map((item) => item.id),
            type: 2,
            param: params.param,
          }).then((res) => handleProTableRes(res));
        }}
      />
    </Modal>
  );
};
