/*
 * @Author: wangrui
 * @Date: 2022-08-22 10:22:17
 * @LastEditors: wangrui
 * @Description:窜货处罚管理列表 fleeingPunishmentList
 * @LastEditTime: 2022-09-23 11:27:23
 */

import { Fragment, useRef, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { Button, Upload, message } from 'antd';
import { handleProTableRes, downLoadFile } from '@/utils/index';
import { fleeingManagementList, exportExcels } from './serveice';
import { openPage } from '@/utils/windowLayout';

function fleeingPunishmentList() {
  const proTableRef = useRef();
  const [exportLoading, setExportLoading] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选择的值id
  const columns = [
    { title: '序号', dataIndex: 'index', valueType: 'index', width: 48 },
    { title: '表单号', dataIndex: 'fleeingManagementCode' },
    { title: '收货通知单表单号', dataIndex: 'fleeingReceivingCode' },
    { title: '严重窜货认定', dataIndex: 'seriousName' },
    { title: '经销商', dataIndex: 'dealerName' },
    { title: '所属事业部', dataIndex: 'regionName' },
    { title: '所属分办', dataIndex: 'branchName', hideInSearch: true },
    { title: '奖励金总额（元）', dataIndex: 'totalReward', hideInSearch: true },
    { title: '倍数', dataIndex: 'multiple', hideInSearch: true },
    { title: '实际取消奖励金（元）', dataIndex: 'cancelBonus', hideInSearch: true },
    { title: '扣除专项秩序保证金（元）', dataIndex: 'securityDeposit', hideInSearch: true },
    { title: '提高结算价', dataIndex: 'raiseTheSettlementPrice', hideInSearch: true },
    { title: '扣除销量(万元)', dataIndex: 'deductSales', hideInSearch: true },
    { title: '被窜货地省市区', dataIndex: 'occurrence', hideInSearch: true },
    { title: '分公司经理（窜货地）', dataIndex: 'branchPersonnelName' },
    { title: '处罚金额', dataIndex: 'deductedManager', hideInSearch: true },
    { title: '城市经理（窜货地）', dataIndex: 'saleDivisionName' },
    { title: '处罚金额', dataIndex: 'deductedCity', hideInSearch: true },
    { title: '业务员（窜货地）', dataIndex: 'salePersonnelName' },
    { title: '处罚金额', dataIndex: 'deductedSale', hideInSearch: true },
    { title: '回收时间', dataIndex: 'createDateReceiving', valueType: 'date' },
    { title: '取证数量（瓶）', dataIndex: 'quantity', hideInSearch: true },
    { title: '品种', dataIndex: 'variety', hideInSearch: true },
    { title: '取证价格（元/瓶）', dataIndex: 'forensicPrice', hideInSearch: true },
    { title: '窜货酒提货数量', dataIndex: 'unit', hideInSearch: true },
    { title: '窜货酒提货日期', dataIndex: 'factoryDate', hideInSearch: true },
    { title: '窜货地历史处理次数', dataIndex: 'processingTimes', hideInSearch: true },
    { title: '处罚次数', dataIndex: 'penaltyTimes', hideInSearch: true },
    { title: '月度跨区扫码率', dataIndex: 'scanningRate', hideInSearch: true },
    { title: '总区跨区扫码率', dataIndex: 'crossRegionScanningRate', hideInSearch: true },
    { title: '状态', dataIndex: 'statusName', hideInSearch: true },
    { title: '标签', dataIndex: 'seriousName', hideInSearch: true },
    { title: '创建人', dataIndex: 'createName' },
    { title: '创建时间', dataIndex: 'createDate', hideInSearch: true },
    { title: '最近修改人', dataIndex: 'modifyName', hideInSearch: true },
    { title: '最近修改时间', dataIndex: 'modifyDate', hideInSearch: true },
  ];
  const rowSelection = {
    selectedRowKeys,
    type: 'radio',
    onChange: (rowskey, selectedRows) => {
      console.log('rowskey', rowskey);
      setSelectedRowKeys(rowskey);
    },
  };

  return (
    <Fragment>
      <ProTable
        rowSelection={rowSelection}
        formRef={proTableRef}
        columns={columns}
        rowKey='id'
        scroll={{ x: 4600 }}
        headerTitle='窜货处罚管理列表'
        options={{ fullScreen: false, reload: false, setting: true }}
        request={(params) => fleeingManagementList(params).then((res) => handleProTableRes(res))}
        search={{
          labelWidth: 145,
          showHiddenNum: true,
        }}
        toolBarRender={() => [
          <Button
            onClick={() => {
              editRecord('view');
            }}
            type='primary'
          >
            查看
          </Button>,
          // <Button
          //   onClick={() => {
          //     editRecord('edit');
          //   }}
          //   type='primary'
          // >
          //   编辑
          // </Button>,
          <Button loading={exportLoading} onClick={exportFile}>
            导出
          </Button>,
        ]}
      ></ProTable>
    </Fragment>
  );

  function editRecord(type) {
    if (selectedRowKeys.length != 1) {
      message.error('请选择一行数据！');
      return;
    }
    openPage({
      pathname: `/fleeingManagement/fleeingPunishmentList/fleeingForm`,
      query: { id: selectedRowKeys[0], type },
      name: `${type == 'edit' ? '编辑' : '查看'}窜货处罚管理`,
    });
  }
  // 导出
  async function exportFile() {
    setExportLoading(true);
    let res = await exportExcels({});
    downLoadFile(res, '窜货处罚管理');
    setExportLoading(false);
  }
}
export default fleeingPunishmentList;
