import React, { Fragment, useRef, useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { getPriceList, exportExcel, getClueDetails, isCreateCheckReport } from './service';
import { getStatusList } from '@/services/common';
import { ProTable } from '@ant-design/pro-components';
import { handleProTableRes, handleRes } from '@/utils/index';
import { Container } from '@/utils';
import { openPage } from '@/utils/windowLayout';
import Distributor from '../../components/Distributor';
import { SUCCESS_CODE, TABLE_CONFIG, HANDLE_TYPE } from '@/constants';
import { Access, useAccess } from '@umijs/max';

export default () => {
  const btnCodes = useAccess().route_btn_codes();
  const [accessBtnCode,setAccessBtnCode] = useState(btnCodes);
  const proTableRef = useRef();
  const proActionRef = useRef();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选择的值id
  const [selectedRow, setSelectedRow] = useState([]); // 选择的值record
  const [statusOption, setStatusOption] = useState([]);

  const [transferVisible, setTransferVisible] = useState(false); // 移交人弹窗

  const [createLoading, setCreateLoading] = useState(false); // 创建报告单的转圈
  const [checkLoading, setCheckLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const columns = [
    {
      title: '编号',
      key: 'priceAbnormalCode',
      dataIndex: 'priceAbnormalCode',
      fixed: 'left',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '线索渠道',
      key: 'onLineStateName',
      dataIndex: 'onLineStateName',
      fixed: 'left',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '案件线索来源',
      key: 'leadSourceName',
      dataIndex: 'leadSourceName',
      fixed: 'left',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '发现地址',
      key: 'terminalAddress',
      dataIndex: 'terminalAddress',
      fixed: 'left',
      width: 150,
    },
    {
      title: '门店名称',
      key: 'terminalName',
      dataIndex: 'terminalName',
      width: 150,
    },
    {
      title: '提报人',
      key: 'name',
      dataIndex: 'name',
      width: 150,
    },
    {
      title: '提报人电话',
      key: 'phone',
      dataIndex: 'phone',
      width: 150,
    },
    {
      title: '分配取证人',
      key: 'assignName',
      dataIndex: 'assignName',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '实际取证人',
      key: 'checkName',
      dataIndex: 'checkName',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '取证地址',
      key: 'forensicsAddress',
      dataIndex: 'forensicsAddress',
      width: 150,
    },
    {
      title: '省市区',
      key: 'forensicsAllName',
      dataIndex: 'forensicsAllName',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '状态',
      key: 'priceStatus',
      dataIndex: 'priceStatus',
      width: 150,
      valueType: 'select',
      fieldProps: {
        options: statusOption,
        fieldNames: { label: 'state', value: 'statusType' },
      },
      render: (text, record) => <span>{record.priceStatusName}</span>,
    },
    {
      title: '是否创建核查报告',
      key: 'checkStatusName',
      dataIndex: 'checkStatusName',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '提报时间',
      key: 'createDate',
      dataIndex: 'createDate',
      width: 150,
      hideInSearch: true,
    },
    {
      title: '取证时间',
      key: 'checkDate',
      dataIndex: 'checkDate',
      width: 150,
      hideInSearch: true,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (rowskey, selectedRows) => {
      console.log('rowskey', rowskey);
      setSelectedRowKeys(rowskey);
      setSelectedRow(selectedRows);
    },
  };
  useEffect(() => {
    initStatus();
  }, []);

  const initStatus = async () => {
    let res = await getStatusList();
    let { code, data } = res;
    console.log('res', res);
    if (code === SUCCESS_CODE) {
      setStatusOption(data);
    }
  };

  // 创建核查单
  const creteReport = async () => {
    if (selectedRow.length !== 1) {
      message.info('仅能选择一项创建');
      return;
    }
    setCreateLoading(true);
    let forensicsIds = selectedRow.map((item) => item.forensicsId);
    let { code, message: msg } = await isCreateCheckReport({
      forensicsIds: forensicsIds,
      ids: selectedRowKeys,
      type: 1,
    });
    setCreateLoading(false);
    if (code === SUCCESS_CODE) {
      openPage({
        pathname: `/processForm/feelForm/${selectedRow[0].id}`,
        state: {
          forensicsIds,
          type: 1,
        },
        name: '核查报告',
      });
    }
  };

  const handleTransfer = () => {
    if (selectedRow.length === 0) {
      message.info('至少选择一项移交');
      return;
    }
    // 判断状态为未处理才能移交
    for (let i = 0; i < selectedRow.length; i++) {
      if (selectedRow[i].priceStatus !== 2) {
        message.info('仅未处理的线索信息可以移交');
        return;
      }
    }

    setTransferVisible(true);
  };

  // 处理查看
  const handleCheck = async () => {
    if (selectedRow.length !== 1) {
      message.info('只能选择一项进行查看');
      return;
    }
    setCheckLoading(true);
    let { code, data } = await getClueDetails(selectedRowKeys[0]);
    setCheckLoading(false);
    if (code === SUCCESS_CODE) {
      openPage({
        pathname: `/priceResearch/detailPage/${selectedRowKeys[0]}`,
        state: {
          detailsData: data,
          records: selectedRow,
        },
        name: '查看价格异常',
      });
    }
  };

  const download = async () => {
    let searchParams = proTableRef.current.getFieldsValue();
    setDownloadLoading(true);
    try {
      const blob = await exportExcel(searchParams);
      let blobUrl = window.URL.createObjectURL(blob);
      let aElement = document.createElement('a'); //创建a标签元素
      let filename = '价格异常报告.xlsx'; //设置文件名称
      aElement.href = blobUrl; //设置a标签路径
      aElement.download = filename;
      aElement.click();
      window.URL.revokeObjectURL(blobUrl);
      aElement.remove();
      setDownloadLoading(false);
    } catch (error) {
      message.error('文件下载失败');
      setDownloadLoading(false);
    }
  };
  return (
    <Fragment>
      <ProTable
        formRef={proTableRef}
        actionRef={proActionRef}
        headerTitle='价格异常'
        {...TABLE_CONFIG}
        scroll={{ x: 1600 }}
        toolBarRender={() => [
          <Access accessible={accessBtnCode['reprotBtn'] || false}>
            <Button
              loading={createLoading}
              onClick={() => {
                creteReport();
              }}
              type='primary'
            >
              创建核查单
            </Button>
          </Access>,
          <Access accessible={accessBtnCode['transfer'] || false}>
          <Button
            onClick={() => {
              handleTransfer();
            }}
            type='primary'
          >
            移交
          </Button>
          </Access>,
          <Button
            loading={checkLoading}
            onClick={() => {
              handleCheck();
            }}
            type='primary'
          >
            查看
          </Button>,
          <Button
            loading={downloadLoading}
            onClick={() => {
              download();
            }}
            type='primary'
          >
            导出
          </Button>,
        ]}
        request={async (params) => getPriceList(params).then((res) => handleProTableRes(res))}
        rowSelection={rowSelection}
        columns={columns}
      />
      {transferVisible && <Distributor visible={transferVisible} setVisible={setTransferVisible} records={selectedRow} actionRef={proActionRef} type={HANDLE_TYPE.priceSearch} />}
    </Fragment>
  );
};
