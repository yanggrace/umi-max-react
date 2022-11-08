import React, { Fragment, useRef, useState, useEffect } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { cloneDeep, debounce } from 'lodash';
import { useModel } from '@@/plugin-model';
import DetailModal from './components/detailModal'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { Button, message, Modal } from 'antd'
import { TABLE_CONFIG } from '@/constants'
import { initColumnsStateMap, columnsStateMapToArray, downLoadFile,Container } from '@/utils'
import {
    allArea,
    allCompany,
    salesmanReportManage,
    findContractDealerPage,
    dealerStockReport,
    excelExport
} from './service';
const renderParams = (obj) => {
    if (obj.region) {
        return {
            roleType: '2',
            params: { regionCode: obj.regionCode, branchReportStatus: true }
        }
    } else if (obj.branch) {
        return {
            roleType: '3',
            params: { branchCode: obj.branchCode, regionCode: obj.regionCode }
        }
    } else {
        return {
            roleType: '1',
            params: { regionReportStatus: true }
        }
    }
}

function SalesmanOne() {
    const tableFormRef = useRef();
    const { initialState: { orgInfo = {} } } = useModel('@@initialState');
    // roleType 1:管理中心 2:事业部 3:分办
    const { roleType, params } = renderParams(orgInfo);
    const [area, setArea] = useState([])
    const [concatColumns, setConcatColumns] = useState([])
    const [branchArr, setBranchArr] = useState([])
    const [dealerArr, setDealerArr] = useState([])
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [curRecord, setCurRecord] = useState({})
    const [submitLoading, setSubmitLoading] = useState(false)
    const [columnsStateMap, setColumnsStateMap] = useState([]);
    const [exportLoading, setExportLoading] = useState(false);
    const weekFormat = 'YYYY-MM-DD';
    const customWeekStartEndFormat = (value) =>
        `${moment(value).startOf('week').format(weekFormat)} ~ ${moment(value)
            .endOf('week')
            .format(weekFormat)}`;
    const columns1 = [
        { title: '序号', dataIndex: 'index', valueType: 'index', width: 48, fixed: 'left' },
        {
            title: '事业部',
            width: 150,
            search: roleType == '1',
            hideInTable: roleType != '1',
            fixed: 'left',
            dataIndex: 'regionCode',
            valueType: 'select',
            fieldProps: {
                options: area,
                fieldNames: { label: 'areaName', value: 'areaId' },
                showSearch: true,
                filterOption: (inputValue, option) => option.areaName.includes(inputValue),
                onChange: getAllCompany
            }
        },
        {
            title: '分办',
            width: 150,
            search: ['1', '2'].some(v => v == roleType),
            hideInTable: !(['1', '2'].some(v => v == roleType)),
            dataIndex: 'branchCode',
            fixed: 'left',
            valueType: 'select',
            fieldProps: {
                options: branchArr,
                showSearch: true,
                filterOption: (inputValue, option) => option.companyName.includes(inputValue),
                onChange: e => { getDealerArr() },
                fieldNames: { label: 'companyName', value: 'companyId' },
            },
            render: (text, record) => (<span>{record.branchName}</span>)
        },
        {
            title: '经销商',
            width: 150,
            dataIndex: 'dealerCode',
            fixed: 'left',
            valueType: 'select',
            fieldProps: {
                options: dealerArr,
                showSearch: true,
                filterOption: (inputValue, option) => option.franchiserName.includes(inputValue),
                fieldNames: { label: 'franchiserName', value: 'franchiserCode' },
            },
            render: (text, record) => (<span style={{ color: record.isRed ? 'red' : '#000' }}>{record.dealerName}</span>)
        },
        {
            title: '选择时间',
            width: 150,
            dataIndex: 'week',
            hideInTable: true,
            valueType: 'date',
            fieldProps: {
                picker: 'week',
                format: customWeekStartEndFormat
            }
        }
    ]
    const columns2 = [
        {
            title: '合计数量',
            dataIndex: 'totalCount',
            search: false,
            width: 150,
        },
        {
            title: '合计金额（万元）',
            dataIndex: 'total',
            search: false,
            width: 150,
        },
        {
            title: '操作',
            width: 100,
            valueType: 'option',
            dataIndex: 'option',
            fixed: 'right',
            render: (text, record, _, action) => [
                <a onClick={() => {
                    setCurRecord(record);
                    setDetailModalVisible(true)
                }} key='detail'>查看详情</a>
            ]
        }
    ]
    useEffect(() => {
        if (roleType == '1') {
            getAllArea()
        } else if (roleType == '2') {
            getAllCompany(orgInfo.regionCode)
        } else if (roleType == '3') {
            getDealerArr()
        }
    }, [])
    return (<Fragment>
        <ProTable
            formRef={tableFormRef}
            scroll={{ x: (concatColumns.reduce((m, n) => (m + n.width), 0)) + (columns2.reduce((m, n) => (m + n.width), 0)) + (columns1.reduce((m, n) => (m + n.width), 0)) }}
            params={params}
            toolBarRender={() => [
                <Button loading={exportLoading} onClick={exportFile} type='primary'>导出</Button>,
                <>{['2', '3'].some(v => v == roleType) && <Button loading={submitLoading} onClick={() => { submitFun() }} type='primary'>提报</Button>}</>,
            ]}
            columnsState={{
                value: columnsStateMap,
                onChange: (columns) => {
                    setColumnsStateMap(columns);
                },
            }}
            headerTitle="业务员提报管理中心"
            request={async (body) => {
                let newParams = cloneDeep(body);
                if (newParams.week) {
                    newParams.week = newParams.week.split(' ~ ');
                    newParams.weekStartDate = newParams.week[0];
                    newParams.weekEndDate = newParams.week[1];
                }
                delete newParams.week
                return salesmanReportManage(newParams, roleType).then(res => handleProTableRes(res))
            }}
            search={{ labelWidth: 'auto' }}
            {...TABLE_CONFIG}
            rowKey="key"
            columns={[
                ...columns1,
                ...concatColumns,
                ...columns2
            ]}
        />
        <DetailModal getWeek={getWeek} curRecord={curRecord} visible={detailModalVisible} setVisible={setDetailModalVisible} />
    </Fragment>)
    // 
    function exportFile() {
        let exportArr = columnsStateMapToArray(columnsStateMap);
        tableFormRef.current.validateFields().then(async val => {
            let newVal = cloneDeep(val);
            if (newVal.week) {
                newVal.week = newVal.week.split(' ~ ');
                newVal.weekStartDate = newVal.week[0];
                newVal.weekEndDate = newVal.week[1];
            }
            delete newVal.week
            newVal.exportSort = exportArr;
            let body = Object.assign(newVal, params);
            try {
                setExportLoading(true)
                let res = await excelExport(body, roleType);
                downLoadFile(res, '业务员提报')
                setExportLoading(false)
            } catch (err) {
                setExportLoading(false)
            }
        })
    }
    // 点击提报
    async function submitFun(bol = false) {
        try {
            setSubmitLoading(true)
            let res = await dealerStockReport({ reportType: roleType == '3' ? '0' : '1', confirmReport: bol })
            setSubmitLoading(false)
            if (res.code == "A0505") {
                Modal.confirm({
                    title: '提示',
                    getContainer:Container,
                    icon: <ExclamationCircleOutlined />,
                    content: res.message || '',
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => { submitFun(true) }
                });
                return
            }
            message.success('提报成功')
        } catch (err) {
            setSubmitLoading(false)
        }
    }
    function getWeek() {
        let week = tableFormRef.current.getFieldValue('week');
        if (week) {
            week = customWeekStartEndFormat(week)
        }
        return week
    }
    // 处理返回
    function handleProTableRes({ code, data: { data, head } }) {
        setCol(head)
        return {
            success: code === '00000',
            total: data?.total,
            data: data?.records.map(v => ({
                ...v,
                ...v.productInfo,
                total: rowTotal(v.productInfo, 'A'),
                totalCount: rowTotal(v.productInfo, 'N'),
            })),
        }
    }
    // 设置行合计金额
    function rowTotal(obj, field) {
        let total = 0;
        for (let i in obj) {
            if (i.includes(field)) {
                total = total + obj[i]
            }
        }
        return total
    }
    // 设置动态列
    function setCol(obj = {}) {
        let c = []
        for (let i in obj) {
            c.push({
                title: obj[i],
                dataIndex: i,
                search: false,
                width: 150,
            })
        }
        let b = initColumnsStateMap([
            ...columns1,
            ...c,
            ...columns2]);
        setColumnsStateMap(b)
        setConcatColumns(c)
    }
    // 请求事业部
    async function getAllArea() {
        try {
            let { data } = await allArea();
            setArea(data)
        } catch (err) { }
    }
    // 请求分公司
    async function getAllCompany(areaId) {
        try {
            tableFormRef.current.setFieldsValue({
                branchCode: undefined,
                dealerCode: undefined
            })
            let res = await allCompany(areaId);
            setBranchArr(res.data)
        } catch (err) { }
    }
    // 请求经销商
    async function getDealerArr(dealerCodeOrName = '') {
        const newOrgCode = roleType == '3' ? orgInfo.branchCode : tableFormRef.current.getFieldValue('branchCode');
        try {
            tableFormRef.current.setFieldsValue({
                dealerCode: undefined
            })
            if (!newOrgCode) {
                setDealerArr([])
                return
            }
            let { data } = await findContractDealerPage({ orgCode: newOrgCode, dealerCodeOrName });
            setDealerArr(data.rows)
        } catch (err) { }
    }
}

export default SalesmanOne