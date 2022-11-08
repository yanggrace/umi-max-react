import React, { Fragment, useRef, useState, useEffect } from 'react';
import { Button, message } from 'antd'
import { getBaseProductList, getCategoryList, getNextList, getProvince, getCity, deleteRecord } from './service'
import { ProTable } from '@ant-design/pro-components';
import { handleProTableRes, handleRes } from '@/utils/index';
import { Container } from '@/utils';
import Distributor from '../../components/Distributor';

export default () => {
    const proTableRef = useRef();
    const proActionRef = useRef();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选择的值id
    const [selectedRow, setSelectedRow] = useState([]); // 选择的值record

    const [transferVisible, setTransferVisible] = useState(false); // 移交人弹窗

    const columns = [
        { 
            title: '序号', 
            dataIndex: 'index', 
            valueType: 'index', 
            fixed: 'left',
            width: 48
        },
        {
            title: '标题',
            key: 'title',
            dataIndex: 'title',
            width: 150,
            hideInSearch: true,
        },
        {
            title: '表单号',
            key: 'test111',
            dataIndex: 'test111',
            fixed: 'left',
            width: 150,
        },
        {
            title: '制定日期',
            key: 'test1',
            dataIndex: 'test1',
            width: 150,
            valueType: 'dateRange'
        },
        {
            title: '经销商',
            key: 'test2',
            dataIndex: 'test2',
            fixed: 'left',
            width: 150,
        },
        {
            title: '是否严重窜货',
            key: 'test3',
            dataIndex: 'test3',
            width: 150,
            valueType: 'select',
            fieldProps: {
                options: [{
                    label: '请选择状态',
                    value: '',
                }, {
                    label: '是',
                    value: 0,
                }, {
                    label: '否',
                    value: 1,
                }],
            },
        },
        {
            title: '提交状态',
            key: 'test4',
            dataIndex: 'test4',
            width: 150,
            hideInSearch: true,
        },
        {
            title: '创建整改单状态',
            key: 'test5',
            dataIndex: 'test5',
            width: 150,
            hideInSearch: true,
        },
        {
            title: '创建经销商处罚单状态',
            key: 'test122',
            dataIndex: 'test122',
            width: 150,
            hideInSearch: true,
        },
        {
            title: '提报人',
            key: 'test1222',
            dataIndex: 'test1222',
            width: 150,
            hideInSearch: true,
        },
    ]

    const rowSelection = {
        selectedRowKeys,
        onChange: (rowskey, selectedRows) => {
            console.log('rowskey', rowskey);
            setSelectedRowKeys(rowskey);
            setSelectedRow(selectedRows);
        }
    }
    useEffect(() => {
    }, [])

    return (<Fragment>
        <ProTable
            formRef={proTableRef}
            actionRef={proActionRef}
            headerTitle="价格异常"
            scroll={{ x: 1600 }}
            toolBarRender={() => [
                <Button onClick={() => {
                    
                }} type='primary'>创建整改单</Button>,
                <Button onClick={() => {}} type='primary'>查看</Button>,
                <Button onClick={() => {}} type='primary'>导出</Button>,
            ]}
            request={async (params) => getBaseProductList(params).then(res => handleProTableRes(res))}
            search={{ labelWidth: 'auto' }}
            rowSelection={rowSelection}
            tableAlertRender={false}
            tableAlertOptionRender={false}
            revalidateOnFocus={false}
            rowKey="id"
            columns={columns}
        />
        {transferVisible && <Distributor visible={transferVisible} setVisible={setTransferVisible} records={selectedRow}/>}
    </Fragment>)
}