import React, { Fragment, useRef, useState, useEffect } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { cloneDeep, debounce } from 'lodash';
import moment from 'moment';
import { TABLE_CONFIG } from '@/constants'
import DetailModal from './components/detailModal'
import CompareModal from './components/compareModal';
import {
    allArea,
    allCompany,
    dealerReportManage,
    findContractDealerPage,
} from './service';

const debounceFun = debounce((func, e) => { func(e) }, 500);

function DealerCenter() {
    const tableFormRef = useRef();
    const [area, setArea] = useState([])
    const [branchArr, setBranchArr] = useState([])
    const [dealerArr, setDealerArr] = useState([])
    const [concatColumns, setConcatColumns] = useState([])
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [compareModalVisible,setCompareModalVisible] = useState(false)
    const [curRecord, setCurRecord] = useState({})
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
            render: (text, record) => (<span>{record.dealerName}11</span>)
        },
        {
            title: '选择时间',
            width: 150,
            dataIndex: 'week',
            hideInTable: true,
            valueType: 'date',
            fieldProps: {
                picker:'week',
                format:customWeekStartEndFormat
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
            width: 150,
            valueType: 'option',
            dataIndex: 'option',
            fixed: 'right',
            render: (text, record, _, action) => [
                <a onClick={() => {
                    setCurRecord(record);
                    setDetailModalVisible(true)
                }} key='detail'>查看详情</a>,
                <a  onClick={() => {
                    setCurRecord(record);
                    setCompareModalVisible(true)
                }} key='compare'>对比</a>
            ]
        }
    ]
    useEffect(() => {
        getAllArea()
    }, [])
    return (<Fragment>
        <ProTable
            formRef={tableFormRef}
            scroll={{ x: (concatColumns.reduce((m, n) => (m + n.width), 0)) + (columns2.reduce((m, n) => (m + n.width), 0)) + (columns1.reduce((m, n) => (m + n.width), 0)) }}
            headerTitle="经销商提报"
            request={async (params) => {
                let newParams = cloneDeep(params);
                if (newParams.week) {
                    newParams.week = newParams.week.split(' ~ ');
                    newParams.weekStartDate = newParams.week[0];
                    newParams.weekEndDate = newParams.week[1];
                    delete newParams.week
                }
                return dealerReportManage(newParams).then(res => handleProTableRes(res))
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
        <CompareModal getWeek={getWeek} curRecord={curRecord} visible={compareModalVisible} setVisible={setCompareModalVisible} />
    </Fragment>)
    function getWeek(){
        let week = tableFormRef.current.getFieldValue('week');
        if(week){
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
        const orgCode = tableFormRef.current.getFieldValue('branchCode');
        try {
            tableFormRef.current.setFieldsValue({
                dealerCode: undefined
            })
            if (!orgCode) {
                setDealerArr([])
                return
            }
            let { data } = await findContractDealerPage({ orgCode, dealerCodeOrName });
            setDealerArr(data.rows)
        } catch (err) { }
    }
}

export default DealerCenter