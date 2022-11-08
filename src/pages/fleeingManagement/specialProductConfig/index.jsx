/*
 * @Author: wangrui
 * @Date: 2022-08-19 17:05:33
 * @LastEditors: wangrui
 * @Description:特殊产品配置
 * @LastEditTime: 2022-09-01 11:16:10
 */
import { Fragment, useRef, useState } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { Button, Upload, message, Popconfirm } from 'antd';
import { specialConfigList, deleteSpecialConfig, downloadExcelTemplate } from './service';
import { handleProTableRes, handleRes, downLoadFile } from '@/utils/index';
import ImportFileBottom from '@/components/importFIlesButton';
import AddConfig from './components/addConfig';
import { okColumn, errColumn } from './config';
const columns = [
  { title: '序号', dataIndex: 'index', valueType: 'index', width: 48 },
  { title: '品类', dataIndex: 'categoryName', hideInSearch: true },
  { title: '品牌', dataIndex: 'brandName', hideInSearch: true },
  { title: '系列', dataIndex: 'seriesName', hideInSearch: true },
  { title: '大类', dataIndex: 'bigLevelName', hideInSearch: true },
  { title: '细类', dataIndex: 'smallLevelName', hideInSearch: true },
  { title: '产品编码', dataIndex: 'productCode', hideInSearch: true },
  { title: '产品名称', dataIndex: 'productName' },
  { title: '创建人', dataIndex: 'createName' },
  { title: '创建时间', dataIndex: 'createDate', hideInSearch: true },
  { title: '最近修改人', dataIndex: 'modifyName', hideInSearch: true },
  { title: '最近修改时间', dataIndex: 'modifyDate', hideInSearch: true },
];
function specialProductConfig() {
  const proTableRef = useRef();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选择的值id
  const [selectedRow, setSelectedRow] = useState([]); // 选择的值record
  const [temBtnLoading, setTemBtnLoading] = useState(false);
  const [configParams, setConfigParams] = useState({
    data: {},
    visible: false,
    type: 1, // 1 新增 2 编辑
  });
  const rowSelection = {
    selectedRowKeys,
    onChange: (rowskey, selectedRows) => {
      console.log('rowskey', rowskey);
      setSelectedRowKeys(rowskey);
      setSelectedRow(selectedRows);
    },
  };

  return (
    <Fragment>
      <ProTable
        actionRef={proTableRef}
        rowSelection={rowSelection}
        columns={columns}
        tableAlertRender={false}
        rowKey='id'
        headerTitle='特殊产品配置'
        scroll={{ x: 1500 }}
        options={{ fullScreen: false, reload: false, setting: true }}
        request={(params) => specialConfigList(params).then((res) => handleProTableRes(res))}
        toolBarRender={() => [
          <Button
            type='primary'
            onClick={() => {
              setConfigParams({
                visible: true,
                type: 1,
                data: '',
                tableRef: proTableRef,
              });
            }}
          >
            新增
          </Button>,
          <Button
            type='primary'
            onClick={() => {
              if (selectedRowKeys.length !== 1) {
                message.warn('请选择一行数据');
                return;
              }
              setConfigParams({
                visible: true,
                type: 2,
                id: selectedRowKeys[0],
                tableRef: proTableRef,
              });
            }}
          >
            编辑
          </Button>,
          <Popconfirm title='确定删除' onConfirm={handleDelete} okText='确认' cancelText='取消'>
            <Button type='primary' danger>
              删除
            </Button>
          </Popconfirm>,
          <Button type='primary' loading={temBtnLoading} onClick={templateDownload}>
            模版下载
          </Button>,
          <ImportFileBottom config={{ width: 1200 }} url='/api/oims/special/product/config/excel/import' errColumn={errColumn} okColumn={okColumn} callback={() => proTableRef?.current?.reload()} />,
        ]}
      ></ProTable>
      <AddConfig params={configParams} setEditParams={setConfigParams}></AddConfig>
    </Fragment>
  );
  // 删除
  async function handleDelete() {
    if (selectedRowKeys.length < 1) {
      message.warn('请至少选择一行数据');
      return;
    }
    await deleteSpecialConfig(selectedRowKeys);
    message.success('删除成功');
    proTableRef?.current?.reload();
  }
  // 下载模板
  async function templateDownload() {
    try {
      setTemBtnLoading(true);
      let res = await downloadExcelTemplate();
      downLoadFile(res, '特殊产品配置导入模板');
    } catch (err) {
    } finally {
      setTemBtnLoading(false);
    }
  }
}
export default specialProductConfig;
