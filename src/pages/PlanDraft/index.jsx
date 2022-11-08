import React, { Fragment, useRef, useState, useEffect } from 'react';
import { Button, Input, Table, Modal, DatePicker, Popconfirm, message, InputNumber, Select, Upload } from 'antd';
import styles from './index.less';
import ProCard from '@ant-design/pro-card';
import {
    SisternodeOutlined,
    SubnodeOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/zh-cn';
import { handleProTableRes, handleRes } from '@/utils/index';
import {
    getBranch,
    getCity,
    getArea,
    getPlans,
    getRegion,
    getAssignUsers,
    saveRoutinePlan,
    deleteRoutinePlan,
    editRoutinePlan,
    getExcelTemplate
} from './service';
import { ProTable } from '@ant-design/pro-components';
import { TABLE_CONFIG } from '@/constants';
const { Option } = Select;
const { TextArea } = Input;
const dateFormat = 'YYYY-MM-DD';
export default () => {
    const proTableRef = useRef();
    const proActionRef = useRef();
    const uploadRef = useRef();
    const [data, setData] = useState([]);
    const [addPersons, setAddPersons] = useState([]);
    const [personAddIsShow, setPersonAddIsShow] = useState(false);
    const [allBranches, setAllBranches] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [addRecord, setAddRecord] = useState([]);
    const [itemRegions, setItemRegions] = useState([]);
    // const [isEdit, setIsEdit] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]); // 选择的值
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选择的值

    useEffect(() => {
        getRegion().then(res => {
            setItemRegions(res.data)
        })
    }, [])


    const initData = () => {
        getPlans({}).then(res => {
            handleRes(res, proActionRef);
            setSelectedRows([])
        })
    }
    const handleAddPerson = () => {
        setPersonAddIsShow(true);
        // setIsEdit(false)
    }

    // const handleEditPerson = () => {
    //     if (selectedRows.length < 1) {
    //         message.error('请选择要修改的一行')
    //         return
    //     }
    //     getBranch(selectedRows[0]['regionCode']).then(res => {
    //         setIsEdit(true);
    //         setPersonAddIsShow(true);
    //         setAddPersons([{
    //             ...selectedRows[0],
    //             regionCode: selectedRows[0]['regionCode'] + '_' + selectedRows[0]['regionName'],
    //             branchCode: selectedRows[0]['branchCode'] + '_' + selectedRows[0]['branchName'],
    //             startTime: selectedRows[0]['startTime'],
    //             endTime: selectedRows[0]['endTime'],
    //             describes: selectedRows[0]['describes'],
    //             networkNum: selectedRows[0]['networkNum'],
    //             itemBranches: res.data,
    //         }])
    //     })
    // }

    const deletePerson = () => {
        if (selectedRows.length < 1) {
            message.error('请选择要删除的人员')
            return
        }
        let deleteIds = [];
        selectedRows.map(item => {
            deleteIds.push(item.id)
        })
        deleteRoutinePlan([...deleteIds]).then(res => {
            if (res.code === '00000') {
                // message.success('删除成功')
                // initData()
                handleRes(res, proActionRef);
                setSelectedRows([]);
            }
        })
    }

    const handleCancel = () => {
        setPersonAddIsShow(false)
    }

    const addLine = () => {
        let newAddPersons = JSON.parse(JSON.stringify(addPersons))
        newAddPersons.push({
            key: generateId(),
            regionCode: '0',
            branchCode: '0',
            describes: undefined,
            startTime: undefined,
            endTime: undefined,
            networkNum: undefined
        })
        setAddPersons(newAddPersons)
    }

    const generateId = () => {
        const s = []
        const hexDigits = '0123456789abcdef'
        for (let i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
        }
        s[14] = '4'
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
        s[8] = s[13] = s[18] = s[23] = '-'

        const uuid = s.join('')
        return uuid
    }

    const deleteLine = () => {
        if (addRecord.length < 1) {
            message.error('请选择要移除的行')
            return
        }
        let newAddPersons = []
        if (addPersons.length > 0) {
            addPersons.map(item => {
                if (!addRecord.includes(item.key)) {
                    newAddPersons.push({ ...item })
                }
            })
        }
        setAddPersons(newAddPersons);
        setAddRecord([])
    }

    const changePage = (pageNumber) => {
        getPlans({
            provinceCode: queryProvince,
            cityCode: queryCity,
            areaCode: queryRegion,
            fullName: queryPerson,
        }).then(res => {
            let data = [];
            res.data.records.map((item, index) => {
                data.push({
                    key: (pageNumber - 1) * 6 + index,
                    ...item
                })
            })
            setData(data);
            setCurrentPage(pageNumber)
        })
    }

    const changeAddPersonLine = (record, flag, value) => {
        if (flag === 'regionCode') {
            getBranch(value.split('_')[0]).then(res => {
                let newAddPersons = [];
                addPersons.map(item => {
                    if (item.key === record.key) {
                        newAddPersons.push({
                            ...item,
                            [flag]: value,
                            itemBranches: res.data,
                        })
                    } else {
                        newAddPersons.push({
                            ...item,
                        })
                    }
                })
                setAddPersons(newAddPersons)
            })
        } else if (flag === 'branchCode') {
            let newAddPersons = [];
            addPersons.map(item => {
                if (item.key === record.key) {
                    newAddPersons.push({
                        ...item,
                        [flag]: value,
                    })
                } else {
                    newAddPersons.push({
                        ...item,
                    })
                }
            })
            setAddPersons(newAddPersons)
        } else if (flag === 'networkNum') {
            let newAddPersons = [];
            addPersons.map(item => {
                if (item.key === record.key) {
                    newAddPersons.push({
                        ...item,
                        [flag]: value,
                    })
                } else {
                    newAddPersons.push({
                        ...item,
                    })
                }
            })
            setAddPersons(newAddPersons)
        } else if (flag === 'describes') {
            let newAddPersons = [];
            addPersons.map(item => {
                if (item.key === record.key) {
                    newAddPersons.push({
                        ...item,
                        [flag]: value.target.value,
                    })
                } else {
                    newAddPersons.push({
                        ...item,
                    })
                }
            })
            setAddPersons(newAddPersons)
        }
    }

    const changeDateLine = (record, flag, date, dateString) => {
        if (flag === 'startTime') {
            let newAddPersons = [];
            addPersons.map(item => {
                if (item.key === record.key) {
                    newAddPersons.push({
                        ...item,
                        [flag]: dateString,
                    })
                } else {
                    newAddPersons.push({
                        ...item,
                    })
                }
            })
            setAddPersons(newAddPersons)
        } else if (flag === 'endTime') {
            let newAddPersons = [];
            addPersons.map(item => {
                if (item.key === record.key) {
                    newAddPersons.push({
                        ...item,
                        [flag]: dateString,
                    })
                } else {
                    newAddPersons.push({
                        ...item,
                    })
                }
            })
            setAddPersons(newAddPersons)
        }
    }

    const confirmAddUser = () => {
        if (addPersons.length < 1) {
            message.error('请填写要保存的计划')
            return
        }
        let userParams = [];
        let flag;
        addPersons.map(item => {
            if (!item.regionCode || !item.branchCode || !item.networkNum || !item.startTime || !item.endTime) {
                flag = '请填写完整'
            }
            userParams.push({
                regionCode: item.regionCode ? item.regionCode.split('_')[0] : undefined,
                regionName: item.regionCode ? item.regionCode.split('_')[1] : undefined,
                branchCode: item.branchCode ? item.branchCode.split('_')[0] : undefined,
                branchName: item.branchCode ? item.branchCode.split('_')[1] : undefined,
                networkNum: item.networkNum,
                startTime: item.startTime,
                endTime: item.endTime,
                describes: item.describes
            })
        })
        if (flag) {
            message.error(flag)
            return
        }
        // if (isEdit) {
        //     editRoutinePlan({ ...userParams[0], id: addPersons[0].id }).then(res => {
        //         setPersonAddIsShow(false);
        //         setAddPersons([])
        //         // message.success('编辑成功');
        //         handleRes(res, proActionRef);
        //         setSelectedRows([])
        //         setSelectedRowKeys([])

        //     })
        // } else {
        saveRoutinePlan([...userParams]).then(res => {
            setPersonAddIsShow(false);
            setAddPersons([]);
            handleRes(res, proActionRef);
            // message.success('保存成功');

        })
        // }
    }

    const downloadMould = () => {
        getExcelTemplate().then(res => {
            if (res) {
                const a = document.createElement('a') // 转换完成，创建一个a标签用于下载
                a.download = '秩序专员人员配置模板.xlsx'
                a.href = window.URL.createObjectURL(res)
                a.click()
                a.remove()
            } else {
                message.error('导出失败')
            }
        })
    }


    const uploadUrl = (info) => {
        if (info.file.status === 'done') {
            // message.success('文件上传成功');
            initData()
        }
    }

    // 获取市下拉框
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
            title: '事业部',
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
            title: '计划检查网点数',
            align: 'center',
            key: 'networkNum',
            dataIndex: 'networkNum',
            hideInSearch: true,
        },
        {
            title: '实际检查网点数',
            align: 'center',
            key: 'completeNetworkNum',
            dataIndex: 'completeNetworkNum',
            hideInSearch: true,
        },
        {
            title: '描述',
            align: 'center',
            key: 'describes',
            dataIndex: 'describes',
            hideInSearch: true,
        },
        {
            title: '开始时间',
            align: 'center',
            key: 'startTime',
            dataIndex: 'startTime',
            hideInSearch: true,
        },
        {
            title: '结束时间',
            align: 'center',
            key: 'endTime',
            dataIndex: 'endTime',
            hideInSearch: true,
        },
        {
            title: '提报时间',
            align: 'center',
            key: 'createDate',
            dataIndex: 'createDate',
            hideInSearch: true,
        },
        {
            title: '低价率',
            align: 'center',
            key: 'lowPrice',
            dataIndex: 'lowPrice',
            hideInSearch: true,
        },
        {
            title: '提报人',
            align: 'center',
            key: 'createName',
            dataIndex: 'createName',
            hideInSearch: true,
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
            title: '事业部',
            align: 'center',
            dataIndex: 'regionCode',
            render: (text, record) => <Select
                className="table_input"
                value={record.regionCode}
                style={{ width: '140px', textAlign: 'left' }}
                onChange={changeAddPersonLine.bind(this, record, 'regionCode')}
            >
                <Option value='0'>请选择事业部</Option>
                {
                    itemRegions && itemRegions.length > 0 ? itemRegions.map(item => {
                        return <Option value={item.areaId + '_' + item.areaName}>{item.areaName}</Option>
                    })
                        :
                        null
                }
            </Select>
        },
        {
            title: '分办',
            align: 'center',
            dataIndex: 'branchCode',
            render: (text, record) => <Select
                className="table_input"
                value={record.branchCode}
                style={{ width: '120px', textAlign: 'left' }}
                onChange={changeAddPersonLine.bind(this, record, 'branchCode')}
            >
                <Option value='0'>请选择分办</Option>
                {
                    record.itemBranches ? record.itemBranches.map(item => {
                        return <Option value={item.companyId + '_' + item.companyName}>{item.companyName}</Option>
                    })
                        :
                        null
                }
            </Select>
        },
        {
            title: '检查网点数',
            align: 'center',
            dataIndex: 'networkNum',
            render: (text, record) => <InputNumber
                className="table_input"
                style={{ width: '120px', textAlign: 'left' }}
                placeholder='请输入网点数'
                value={record.networkNum}
                min={0}
                onChange={changeAddPersonLine.bind(this, record, 'networkNum')}
            />
        },
        {
            title: '开始时间',
            align: 'center',
            dataIndex: 'startTime',
            render: (text, record) => <DatePicker
                className="table_input"
                style={{ width: '120px', textAlign: 'left' }}
                value={record.startTime ? moment(record.startTime, dateFormat) : undefined}
                picker='date'
                onChange={changeDateLine.bind(this, record, 'startTime')}
            />
        },
        {
            title: '结束时间',
            align: 'center',
            dataIndex: 'endTime',
            render: (text, record) => <DatePicker
                className="table_input"
                style={{ width: '120px', textAlign: 'left' }}
                value={record.endTime ? moment(record.endTime, dateFormat) : undefined}
                picker='date'
                onChange={changeDateLine.bind(this, record, 'endTime')}
            />
        },
        {
            title: '描述',
            align: 'center',
            dataIndex: 'describes',
            render: (text, record) => <TextArea
                className="table_input"
                style={{ width: '120px', textAlign: 'left' }}
                value={record.describes}
                placeholder='请输入描述'
                onChange={changeAddPersonLine.bind(this, record, 'describes')}
            />
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
                headerTitle="计划制定记录"
                scroll={{ x: 1600 }}
                toolBarRender={() => [
                    <Button onClick={handleAddPerson} type='primary'>新增</Button>,
                    <Popconfirm
                        title="确定删除？"
                        onConfirm={deletePerson}
                        placement="topLeft"
                        okText="是"
                        cancelText="否"
                    >
                        <Button type='primary' style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}>删除</Button>
                    </Popconfirm>,
                ]
                }
                request={async (params) => getPlans(params).then(res => handleProTableRes(res))}
                search={{ labelWidth: 'auto' }}
                rowSelection={rowSelection}
                columns={columns}
            />
            <Modal
                visible={personAddIsShow}
                title="新建计划"
                className="branch_modal"
                width={1200}
                onCancel={handleCancel}
                style={{ marginTop: '-50px' }}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        取消
                    </Button>,
                    <Button key="back" type="primary" onClick={confirmAddUser}>
                        确定
                    </Button>,
                ]}
            >
                <div style={{ marginBottom: '20px' }}>
                    <Button type='primary' className={styles.addbtn} onClick={addLine}>添加行</Button>
                    <Button type='primary' className={styles.addbtn} onClick={deleteLine}>移除行</Button>
                </div>
                <Table
                    columns={columns2}
                    dataSource={addPersons}
                    bordered
                    rowSelection={{
                        type: 'checkbox',
                        onChange: (selectedRowKeys, selectedRows) => {
                            if (selectedRows) {
                                setAddRecord(selectedRowKeys)
                            } else {
                                setAddRecord([])
                            }
                        },
                    }}
                />
            </Modal>
        </div >
    )
}