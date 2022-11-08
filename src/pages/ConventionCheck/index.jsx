import React, { Fragment, useRef, useState, useEffect } from 'react';
import { Button, Input, Table, Modal, DatePicker, Popconfirm, message, Space, Select, Upload } from 'antd';
import styles from './index.less';
import ProCard from '@ant-design/pro-card';
import {
    SisternodeOutlined,
    SubnodeOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { handleProTableRes, handleRes } from '@/utils/index';
import {
    getBranch,
    getCity,
    getArea,
    getPlans,
    getRegion,
    getAssignUsers,
    saveAssignUsers,
    getproductPage,
    editAssignUsers,
    getExcelExport
} from './service';
import { ProTable } from '@ant-design/pro-components';
import { TABLE_CONFIG } from '@/constants';
const { Option } = Select;
const typeMap = ['合格', '低价', '窜货', '假冒侵权'];
const typeArr = [
    { name: '合格', id: 0 },
    { name: '低价', id: 1 },
    { name: '窜货', id: 2 },
    { name: '假冒侵权', id: 3 },
]
export default () => {
    const proTableRef = useRef();
    const proActionRef = useRef();
    // const [data, setData] = useState([]);
    const [productData, setProductData] = useState([]);
    const [personAddIsShow, setPersonAddIsShow] = useState(false);
    const [allBranches, setAllBranches] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    // const [addRecord, setAddRecord] = useState([]);
    const [itemRegions, setItemRegions] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]); // 选择的值
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选择的值
    const [downloading, setDownloading] = useState(false); // 下载loading

    useEffect(() => {
        getRegion().then(res => {
            setItemRegions(res.data)
        })
    }, [])


    // const handleAddPerson = () => {
    //     setPersonAddIsShow(true);
    //     setIsEdit(false)
    // }

    const handleEditProduct = () => {
        if (selectedRows.length !== 1) {
            message.error('请选择一行进行查看')
            return
        }
        getproductPage({
            current: 1,
            size: 10,
            routineInspectId: selectedRows[0].id
        }).then(res => {
            let data = [];
            res.data.records.map((item, index) => {
                data.push({
                    key: index,
                    ...item
                })
            })
            setIsEdit(true);
            setPersonAddIsShow(true);
            setProductData(data)
        })
    }

    const handleCancel = () => {
        setPersonAddIsShow(false)
        setSelectedRows([])
        setSelectedRowKeys([])
    }


    const changePage = (pageNumber) => {
        getproductPage({
            current: 1,
            size: 10,
            routineInspectId: selectedRows[0].id
        }).then(res => {
            let data = [];
            res.data.records.map((item, index) => {
                data.push({
                    key: (pageNumber - 1) * 10 + index,
                    ...item
                })
            })
            setProductData(data);
            setCurrentPage(pageNumber)
        })
    }

    const confirmAddUser = () => {
        if (productData.length < 1) {
            message.error('请填写要保存的人员')
        }
        let userParams = [];
        let flag;
        productData.map(item => {
            if (!item.itemUserMap[item.userName]) {
                flag = '请选择事业部对应的人员'
            }
            userParams.push({
                provinceCode: item.provinceCode ? item.provinceCode.split('_')[0] : undefined,
                provinceName: item.provinceCode ? item.provinceCode.split('_')[1] : undefined,
                cityCode: item.cityCode ? item.cityCode.split('_')[0] : undefined,
                cityName: item.cityCode ? item.cityCode.split('_')[1] : undefined,
                areaCode: item.areaCode ? item.areaCode.split('_')[0] : undefined,
                areaName: item.areaCode ? item.areaCode.split('_')[1] : undefined,
                regionCode: item.regionCode ? item.regionCode.split('_')[0] : undefined,
                regionName: item.regionCode ? item.regionCode.split('_')[1] : undefined,
                userName: item.userName,
                fullName: item.itemUserMap && item.itemUserMap[item.userName] ? item.itemUserMap[item.userName].fullName : undefined,
                orgCode: item.itemUserMap && item.itemUserMap[item.userName] ? item.itemUserMap[item.userName].orgCode : undefined,
                orgName: item.itemUserMap && item.itemUserMap[item.userName] ? item.itemUserMap[item.userName].orgName : undefined,
                positionCode: item.itemUserMap && item.itemUserMap[item.userName] ? item.itemUserMap[item.userName].positionCode : undefined,
                positionName: item.itemUserMap && item.itemUserMap[item.userName] ? item.itemUserMap[item.userName].positionName : undefined,
            })
        })
        if (flag) {
            message.error(flag)
            return
        }
        if (isEdit) {
            editAssignUsers({ ...userParams[0], id: productData[0].id }).then(res => {
                setPersonAddIsShow(false);
                setProductData([])
                // message.success('编辑成功');
                handleRes(res, proActionRef);
                setSelectedRows([])
                setSelectedRowKeys([])

            })
        } else {
            saveAssignUsers([...userParams]).then(res => {
                setPersonAddIsShow(false);
                setProductData([]);
                handleRes(res, proActionRef);
                // message.success('保存成功');

            })
        }
    }

    const downloadMould = () => {
        setDownloading(true)
        getExcelExport({}).then(res => {
            if (res) {
                const a = document.createElement('a') // 转换完成，创建一个a标签用于下载
                a.download = '常规检查纪录.xlsx'
                a.href = window.URL.createObjectURL(res)
                a.click()
                a.remove()
            } else {
                message.error('导出失败')
            }
            setDownloading(false)
        })
    }


    //获取市下拉框
    const getBranchList = async (e) => {
        if (!e) {
            return
        }
        proTableRef.current.setFieldsValue({ cityCode: undefined });
        let { data } = await getBranch(e);
        setAllBranches(data || []);
    }

    const columns = [
        {
            title: '序号',
            align: 'center',
            key: 'index',
            dataIndex: 'index',
            render: (text, record, index) => index + 1,
            hideInSearch: true,
        },
        {
            title: '是否现有终端',
            align: 'center',
            key: 'terminalType',
            dataIndex: 'terminalType',
            render: (text, record) => record.terminalType ? '是' : '否',
            hideInSearch: true,
        },
        {
            title: '终端编码',
            align: 'center',
            key: 'terminalCode',
            dataIndex: 'terminalCode',
            hideInSearch: true,
        },
        {
            title: '终端名称',
            align: 'center',
            key: 'terminalName',
            dataIndex: 'terminalName',
        },
        {
            title: '大区事业部',
            align: 'center',
            key: 'regionCode',
            dataIndex: 'regionCode',
            valueType: 'select',
            fieldProps: {
                options: itemRegions,
                fieldNames: { label: 'areaName', value: 'areaId' },
                showSearch: true,
                filterOption: (inputValue, option) => option.areaName.includes(inputValue),
                onChange: (e) => { getBranchList(e) }
            },
            render: (text, record) => (<span>{record.regionName}</span>)
        },
        {
            title: '分办',
            align: 'center',
            key: 'branchCode',
            dataIndex: 'branchCode',
            valueType: 'select',
            fieldProps: {
                options: allBranches,
                fieldNames: { label: 'companyName', value: 'companyId' },
                showSearch: true,
                filterOption: (inputValue, option) => option.companyName.includes(inputValue),
            },
            render: (text, record) => (<span>{record.branchName}</span>)
        },
        {
            title: '类型',
            align: 'center',
            key: 'type',
            dataIndex: 'type',
            valueType: 'select',
            fieldProps: {
                options: typeArr,
                fieldNames: { label: 'name', value: 'id' },
                showSearch: true,
                filterOption: (inputValue, option) => option.name.includes(inputValue),
            },
            render: (text, record) => (<span>{typeMap[record.type]}</span>)
        },
        {
            title: '调查人',
            align: 'center',
            key: 'userName',
            dataIndex: 'userName',
            render: (text, record) => (<span>{record.createName}</span>)
        },
        {
            title: '调查人岗位',
            align: 'center',
            key: 'createPosName',
            dataIndex: 'createPosName',
            hideInSearch: true,
        },
        {
            title: '终端地址',
            align: 'center',
            key: 'terminalAddress',
            dataIndex: 'terminalAddress',
            hideInSearch: true,
        },
        {
            title: '偏差距离',
            align: 'center',
            key: 'distance',
            dataIndex: 'distance',
            hideInSearch: true,
        },
        {
            title: '调研时间',
            align: 'center',
            key: 'createDate',
            dataIndex: 'createDate',
            // width: 150,
            valueType: 'dateRange',
            render: (text, record) => (<span>{record.createDate}</span>)
        }
    ];

    const columns2 = [
        {
            title: '序号',
            align: 'center',
            dataIndex: 'lineNumber',
            render: (text, record, index) => index + 1,
        },
        {
            title: '产品编码',
            align: 'center',
            dataIndex: 'productCode',
            hideInSearch: true,
        },
        {
            title: '产品名称',
            align: 'center',
            dataIndex: 'productName',
            hideInSearch: true,
        },
        {
            title: '调查价格',
            align: 'center',
            dataIndex: 'price',
        },
        {
            title: '基准价格',
            align: 'center',
            dataIndex: 'basePrice',
        },
        {
            title: '是否低价',
            align: 'center',
            dataIndex: 'lowerPrice',
        },
    ];
    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
            setSelectedRows(selectedRows)
        }
    }
    return (
        <div className={styles.orderDirectorBox}>
            <ProTable
                {...TABLE_CONFIG}
                formRef={proTableRef}
                actionRef={proActionRef}
                headerTitle="常规检查记录"
                scroll={{ x: 1600 }}
                toolBarRender={() => [
                    <Button onClick={handleEditProduct} type='primary'>查看详情</Button>,
                    <Button onClick={downloadMould} type='primary' loading={downloading}>导出</Button>,
                ]
                }
                request={async (params) => getPlans({ ...params, startTime: params.createDate ? params.createDate[0] : undefined, endTime: params.createDate ? params.createDate[1] : undefined }).then(res => handleProTableRes(res))}
                search={{ labelWidth: 'auto' }}
                rowSelection={rowSelection}
                columns={columns}
            />
            <Modal
                visible={personAddIsShow}
                title="查看详情"
                className="branch_modal"
                width={1200}
                onCancel={handleCancel}
                style={{ marginTop: '-50px' }}
                footer={[
                    // <Button key="back" onClick={handleCancel}>
                    //     取消
                    // </Button>,
                    <Button key="back" type="primary" onClick={handleCancel}>
                        关闭
                    </Button>,
                ]}
            >
                <Table
                    columns={columns2}
                    dataSource={productData}
                    bordered
                    pagination={{ pageSize: '10', current: currentPage, total, onChange: changePage }}
                />
            </Modal>
        </div >
    )
}