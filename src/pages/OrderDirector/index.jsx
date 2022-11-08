import React, { Fragment, useRef, useState, useEffect } from 'react';
import { Button, Input, Table, Modal, DatePicker, Popconfirm, message, Space, Select, Upload } from 'antd';
import styles from './index.less';
import ProCard from '@ant-design/pro-card';
import ImportFileBottom from '@/components/importFIlesButton';
import { handleProTableRes, handleRes } from '@/utils/index';
import {
    getProvince,
    getCity,
    getArea,
    getUsers,
    getRegion,
    getAssignUsers,
    saveAssignUsers,
    deleteAssignUsers,
    editAssignUsers,
    getExcelTemplate
} from './service';
import { ProTable } from '@ant-design/pro-components';
import { TABLE_CONFIG } from '@/constants';
import { okColumn, errColumn } from './config';

const { Option } = Select;

export default () => {
    const proTableRef = useRef();
    const proActionRef = useRef();
    const uploadRef = useRef();
    const [data, setData] = useState([]);
    const [addPersons, setAddPersons] = useState([]);
    const [personAddIsShow, setPersonAddIsShow] = useState(false);
    const [queryProvince, setQueryProvince] = useState(undefined);
    const [queryPerson, setQueryPerson] = useState(undefined);
    const [queryCity, setQueryCity] = useState(undefined);
    const [queryRegion, setQueryRegion] = useState(undefined);
    const [allProvinces, setAllProvinces] = useState([]);
    const [allCities, setAllCities] = useState([]);
    const [allRegions, setAllRegions] = useState([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [addRecord, setAddRecord] = useState([]);
    const [itemRegions, setItemRegions] = useState([]);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]); // 选择的值
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选择的值
    const [downloading, setDownloading] = useState(false); // 下载loading

    useEffect(() => {
        getProvince().then(res => {
            setAllProvinces(res.data)
        })
        getRegion().then(res => {
            setItemRegions(res.data)
        })
    }, [])


    const initData = () => {
        getUsers({}).then(res => {
            handleRes(res, proActionRef);
            setSelectedRows([])
        })
    }
    const handleAddPerson = () => {
        setPersonAddIsShow(true);
        setIsEdit(false)
    }
    const emptyPromiseData = {
        code: '00000',
        data: []
    }
    // 处理promise参数为空问题
    function handlePromise(params, callback) {
        let isHaveData  = true
        for (let key in params) {
            if (!params[key]) {
              isHaveData = false;
            }
        }
        if (isHaveData) {
          return callback(params).then((res) => {
            return res;
          });
        } else {
          return {
            code: '00000',
            data: [],
          };
        }
    }
    const handleEditPerson = () => {
        if (selectedRows.length !== 1) {
            message.error('请选择要修改的一行')
            return
        }
        const p1 = handlePromise({ provinceCode: selectedRows[0]['provinceCode'] }, getCity);
        const p2 = handlePromise({ cityCode: selectedRows[0]['cityCode'] },getArea) 
        const p3 = handlePromise({ regionCode: selectedRows[0]['regionCode'] }, getAssignUsers); 
        Promise.all([p1, p2, p3]).then(allResults => {
            let flag;
            allResults.map(item => {
                if (item.code !== '00000') {
                    flag = '获取数据失败'
                }
            })
            if (flag) {
                message.error(flag)
                return
            }
            let itemUserMap = {};
            allResults[2].data.map(item => {
                itemUserMap[item.userName] = { ...item }
            })
            setIsEdit(true);
            setPersonAddIsShow(true);
            setAddPersons([{
                ...selectedRows[0],
                provinceCode: selectedRows[0]['provinceCode'] ? selectedRows[0]['provinceCode'] + '_' + selectedRows[0]['provinceName'] : '0',
                cityCode: selectedRows[0]['cityCode'] ? selectedRows[0]['cityCode'] + '_' + selectedRows[0]['cityName'] : '0',
                areaCode: selectedRows[0]['areaCode'] ? selectedRows[0]['areaCode'] + '_' + selectedRows[0]['areaName'] : '0',
                regionCode: selectedRows[0]['regionCode'] ? selectedRows[0]['regionCode'] + '_' + selectedRows[0]['regionName'] : '0',
                itemCites: allResults[0].data,
                itemAreas: allResults[1].data,
                itemUsers: allResults[2].data,
                itemUserMap
            }])
        })

    }

    const deletePerson = () => {
        if (selectedRows.length < 1) {
            message.error('请选择要删除的人员')
            return
        }
        let deleteIds = [];
        selectedRows.map(item => {
            deleteIds.push(item.id)
        })
        deleteAssignUsers([...deleteIds]).then(res => {
            if (res.code === '00000') {
                // message.success('删除成功')
                // initData()
                handleRes(res, proActionRef);
                setSelectedRows([]);
            }
        })
    }

    const handleCancel = () => {
        setAddPersons([])
        setPersonAddIsShow(false)
    }

    const addLine = () => {
        let newAddPersons = JSON.parse(JSON.stringify(addPersons))
        newAddPersons.push({
            key: generateId(),
            provinceCode: '0',
            cityCode: '0',
            areaCode: '0',
            regionCode: '0',
            userName: '0'
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
    const resetQuery = () => {
        getUsers({}).then(res => {
            if (res.code === '00000') {
                let data = [];
                res.data.records.map((item, index) => {
                    data.push({
                        ...item,
                        key: generateId()
                    })
                })
                setData(data);
                setQueryProvince(undefined);
                setQueryCity(undefined);
                setQueryRegion(undefined);
                setQueryPerson(undefined)
            }
        })
    }

    const selectProvince = (value) => {
        setQueryProvince(value)
        getCity({ provinceCode: value }).then(res => {
            setAllCities(res.data)
        })
    }

    const selectCity = (value) => {
        setQueryCity(value)
        getArea({ cityCode: value }).then(res => {
            setAllRegions(res.data)
        })
    }

    const selectRegion = (value) => {
        setQueryRegion(value)
    }

    const inputPerson = (e) => {
        setQueryPerson(e.target.value)
    }

    const changePage = (pageNumber) => {
        getUsers({
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
        if (flag === 'provinceCode') {
            getCity({ provinceCode: value.split('_')[0] }).then(res => {
                let newAddPersons = [];
                addPersons.map(item => {
                    if (item.key === record.key) {
                        newAddPersons.push({
                            ...item,
                            [flag]: value,
                            itemCites: res.data
                        })
                    } else {
                        newAddPersons.push({
                            ...item,
                        })
                    }
                })
                setAddPersons(newAddPersons)
            })
        } else if (flag === 'cityCode') {
            getArea({ cityCode: value.split('_')[0] }).then(res => {
                let newAddPersons = [];
                addPersons.map(item => {
                    if (item.key === record.key) {
                        newAddPersons.push({
                            ...item,
                            [flag]: value,
                            itemAreas: res.data
                        })
                    } else {
                        newAddPersons.push({
                            ...item,
                        })
                    }
                })
                setAddPersons(newAddPersons)
            })
        } else if (flag === 'areaCode') {
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
        } else if (flag === 'regionCode') {
            getAssignUsers({ regionCode: value.split('_')[0] }).then(res => {
                let newAddPersons = [], itemUserMap = {};
                res.data.map(item => {
                    itemUserMap[item.userName] = { ...item }
                })
                addPersons.map(item => {
                    if (item.key === record.key) {
                        newAddPersons.push({
                            ...item,
                            [flag]: value,
                            itemUsers: res.data,
                            itemUserMap
                        })
                    } else {
                        newAddPersons.push({
                            ...item,
                        })
                    }
                })
                setAddPersons(newAddPersons)
            })
        } else if (flag === 'userName') {
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
        }
    }

    const queryData = () => {
        getUsers({
            provinceCode: queryProvince,
            cityCode: queryCity,
            areaCode: queryRegion,
            fullName: queryPerson,
        }).then(res => {
            if (res.code === '00000') {
                let data = [];
                res.data.records.map((item, index) => {
                    data.push({
                        ...item,
                        key: generateId()
                    })
                })
                setData(data)
            } else {
                message.error(res.message)
            }
        })
    }

    const confirmAddUser = () => {
        if (addPersons.length < 1) {
            message.error('请填写要保存的人员')
        }
        let userParams = [];
        let flag;
        addPersons.map(item => {
            if (!item.itemUserMap[item.userName]) {
                flag = '请选择事业部对应的人员'
            }
            userParams.push({
                provinceCode: item.provinceCode && item.provinceCode !== '0' ? item.provinceCode.split('_')[0] : undefined,
                provinceName: item.provinceCode && item.provinceCode !== '0' ? item.provinceCode.split('_')[1] : undefined,
                cityCode: item.cityCode && item.cityCode !== '0' ? item.cityCode.split('_')[0] : undefined,
                cityName: item.cityCode && item.cityCode !== '0' ? item.cityCode.split('_')[1] : undefined,
                areaCode: item.areaCode && item.areaCode !== '0' ? item.areaCode.split('_')[0] : undefined,
                areaName: item.areaCode && item.areaCode !== '0' ? item.areaCode.split('_')[1] : undefined,
                regionCode: item.regionCode && item.regionCode !== '0' ? item.regionCode.split('_')[0] : undefined,
                regionName: item.regionCode && item.regionCode !== '0' ? item.regionCode.split('_')[1] : undefined,
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
            editAssignUsers({ ...userParams[0], id: addPersons[0].id }).then(res => {
                // initData()
                setPersonAddIsShow(false);
                setAddPersons([])
                // message.success('编辑成功');
                handleRes(res, proActionRef);
                setSelectedRows([])
                setSelectedRowKeys([])

            })
        } else {
            saveAssignUsers([...userParams]).then(res => {
                // initData()
                setPersonAddIsShow(false);
                setAddPersons([]);
                handleRes(res, proActionRef);
                // message.success('保存成功');

            })
        }
    }

    const downloadMould = () => {
        setDownloading(true)
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
            setDownloading(false)
        })
    }


    const uploadUrl = (info) => {
        if (info.file.status === 'done') {
            // message.success('文件上传成功');
            initData()
        }
    }

    // 获取市下拉框
    const getCityList = async (e) => {
        if (!e) {
            return
        }
        proTableRef.current.setFieldsValue({ cityCode: undefined });
        let { data } = await getCity({ provinceCode: e });
        setAllCities(data || []);
    }

    // 获取区下拉框
    const getAreaList = async (e) => {
        if (!e) {
            return
        }
        proTableRef.current.setFieldsValue({ areaCode: undefined });
        let { data } = await getArea({ cityCode: e });
        setAllRegions(data || []);
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
            title: '省',
            align: 'center',
            key: 'provinceCode',
            dataIndex: 'provinceCode',
            valueType: 'select',
            fieldProps: {
                options: allProvinces,
                fieldNames: { label: 'name', value: 'code' },
                showSearch: true,
                filterOption: (inputValue, option) => option.name.includes(inputValue),
                onChange: (e) => { getCityList(e) }
            },
            render: (text, record) => (<span>{record.provinceName}</span>)
        },
        {
            title: '市',
            align: 'center',
            key: 'cityCode',
            dataIndex: 'cityCode',
            valueType: 'select',
            fieldProps: {
                options: allCities,
                fieldNames: { label: 'name', value: 'code' },
                showSearch: true,
                filterOption: (inputValue, option) => option.name.includes(inputValue),
                onChange: (e) => { getAreaList(e) }
            },
            render: (text, record) => (<span>{record.cityName}</span>)
        },
        {
            title: '区',
            align: 'center',
            key: 'areaCode',
            dataIndex: 'areaCode',
            valueType: 'select',
            fieldProps: {
                options: allRegions,
                fieldNames: { label: 'name', value: 'code' },
                showSearch: true,
                filterOption: (inputValue, option) => option.name.includes(inputValue),
            },
            render: (text, record) => (<span>{record.areaName}</span>)
        },
        {
            title: '事业部',
            align: 'center',
            key: 'regionName',
            dataIndex: 'regionName',
            hideInSearch: true,
        },
        {
            title: '人员',
            align: 'center',
            key: 'fullName',
            dataIndex: 'fullName',
        },
        {
            title: '人员岗位',
            align: 'center',
            key: 'positionName',
            dataIndex: 'positionName',
        },
        {
            title: '人员编码',
            align: 'center',
            key: 'userName',
            dataIndex: 'userName',
        },
        {
            title: '创建人',
            align: 'center',
            key: 'createName',
            dataIndex: 'createName',
            hideInSearch: true,
        },
        {
            title: '创建时间',
            align: 'center',
            key: 'createDate',
            dataIndex: 'createDate',
            hideInSearch: true,
        },
        {
            title: '最近修改人',
            align: 'center',
            key: 'modifyName',
            dataIndex: 'modifyName',
            hideInSearch: true,
        },
        {
            title: '最近修改时间',
            align: 'center',
            key: 'modifyDate',
            dataIndex: 'modifyDate',
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
            title: '省',
            align: 'center',
            dataIndex: 'provinceCode',
            render: (text, record) => <Select
                className="table_input"
                value={record.provinceCode}
                style={{ width: '140px', textAlign: 'left' }}
                onChange={changeAddPersonLine.bind(this, record, 'provinceCode')}
            >
                <Option value='0'>请选择省</Option>
                {
                    allProvinces.map(item => {
                        return <Option value={item.code + '_' + item.name}>{item.name}</Option>
                    })
                }
            </Select>
        },
        {
            title: '市',
            align: 'center',
            dataIndex: 'cityCode',
            render: (text, record) => <Select
                className="table_input"
                value={record.cityCode}
                style={{ width: '120px', textAlign: 'left' }}
                onChange={changeAddPersonLine.bind(this, record, 'cityCode')}
            >
                <Option value='0'>请选择市</Option>
                {
                    record.itemCites ? record.itemCites.map(item => {
                        return <Option value={item.code + '_' + item.name}>{item.name}</Option>
                    })
                        :
                        null
                }
            </Select>
        },
        {
            title: '区',
            align: 'center',
            dataIndex: 'areaCode',
            render: (text, record) => <Select
                className="table_input"
                value={record.areaCode}
                style={{ width: '120px', textAlign: 'left' }}
                optionFilterProp="children"
                showSearch
                onChange={changeAddPersonLine.bind(this, record, 'areaCode')}
            >
                <Option value='0'>请选择区</Option>
                {
                    record.itemAreas ? record.itemAreas.map(item => {
                        return <Option value={item.code + '_' + item.name}>{item.name}</Option>
                    })
                        :
                        null
                }
            </Select>
        },
        {
            title: '事业部',
            align: 'center',
            dataIndex: 'regionCode',
            render: (text, record) => <Select
                className="table_input"
                value={record.regionCode}
                style={{ width: '140px', textAlign: 'left' }}
                optionFilterProp="label"
                showSearch
                onChange={changeAddPersonLine.bind(this, record, 'regionCode')}
                // onSearch={searchRegion}
                filterOption={(input, option) =>
                    option.children.includes(input)
                }
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
            title: '人员',
            align: 'center',
            dataIndex: 'userName',
            render: (text, record) => <Select
                className="table_input"
                value={record.userName}
                style={{ width: '140px', textAlign: 'left' }}
                onChange={changeAddPersonLine.bind(this, record, 'userName')}
                optionFilterProp="label"
                showSearch
                // onSearch={searchUser}
                filterOption={(input, option) =>
                    option.children.includes(input)
                }
            >
                <Option value='0'>请选择人员</Option>
                {
                    record.itemUsers ? record.itemUsers.map(item => {
                        return <Option value={item.userName}>{item.fullName}</Option>
                    })
                        :
                        null
                }
            </Select>
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
                headerTitle="秩序专员人员配置"
                scroll={{ x: 1600 }}
                toolBarRender={() => [
                    <Button onClick={handleAddPerson} type='primary'>新增</Button>,
                    <Button onClick={handleEditPerson} type='primary'>编辑</Button>,
                    <Popconfirm
                        title="确定删除？"
                        onConfirm={deletePerson}
                        placement="topLeft"
                        okText="是"
                        cancelText="否"
                    >
                        <Button type='primary' style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f' }}>删除</Button>
                    </Popconfirm>,
                    <Button type='primary' onClick={downloadMould} loading={downloading}>模板下载</Button>,
                    <ImportFileBottom url='/api/oims/forensics/user/assign/excel/import' config={{ width: 1200 }} errColumn={errColumn} okColumn={okColumn} callback={() => proActionRef?.current?.reload()} />,
                    // <input type="file" style={{ position: 'absolute', left: '323px', opacity: 0 }} ref={uploadRef} accept=".xls,.xlsx" class="outputlist_upload" />
                ]
                }
                request={async (params) => getUsers(params).then(res => handleProTableRes(res))}
                search={{ labelWidth: 'auto' }}
                rowSelection={rowSelection}
                columns={columns}
            />
            <Modal
                visible={personAddIsShow}
                title="新建人员配置"
                className="branch_modal"
                width={1100}
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
                {
                    !isEdit && <div style={{ marginBottom: '20px' }}>
                        <Button type='primary' className={styles.addbtn} onClick={addLine}>添加行</Button>
                        <Button type='primary' className={styles.addbtn} onClick={deleteLine}>移除行</Button>
                    </div>
                }
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