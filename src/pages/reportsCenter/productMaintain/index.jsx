import React, { Fragment, useRef, useState } from 'react';
import { Button, Modal, Table, Row, Col, Space, Input, message, Popconfirm } from 'antd'
import { dealerStockProduct, saveProduct, deleteProduct } from './service'
import { handleProTableRes, handleRes,Container } from '@/utils/index';
import { ProTable } from '@ant-design/pro-components';
import { uniqueId, cloneDeep } from 'lodash'
import { TABLE_CONFIG } from '@/constants'

function ProductMaintain() {
    const proTableRef = useRef();
    const [dataSource, setDataSource] = useState([])
    const [loading, setLoading] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [modalParams, setModalParams] = useState({
        visible: false,
        type: ''
    })
    const columns = [
        { title: '序号', dataIndex: 'index', valueType: 'index', width: 48 },
        { title: '产品编码', dataIndex: 'productCode' },
        { title: '产品名称', dataIndex: 'productName' },
        { title: '创建时间', dataIndex: 'createDate', valueType: 'date' },
        { title: '创建人', dataIndex: 'createName', search: false },
        {
            title: '操作',
            width: 120,
            valueType: 'option',
            align: 'center',
            render: (text, record, _, action) => [
                <a key="edit" onClick={() => {
                    let data = [{
                        ...record,
                        key: record.id
                    }]
                    setDataSource(data)
                    setModalParams({
                        type: 'edit',
                        visible: true
                    })
                }}>编辑</a>,
                <Popconfirm
                    key='delete'
                    title={<div>确定删除此产品吗？</div>}
                    onConfirm={() => { deleteFun(record.id) }}
                    okText="确定"
                    cancelText="取消"
                >
                    {record.id > 0 && (<a style={{ color: '#ff4949' }} key="delete" >删除</a>)}
                </Popconfirm>
            ]
        }
    ]
    const formColumns = [
        {
            title: '序号',
            dataIndex: 'index',
            width: 60,
            render: (text, record, index) => (<span>{index + 1}</span>)
        },
        {
            title: '产品编码',
            dataIndex: 'productCode',
            render: (text, record, index) => <Input disabled={modalParams.type == 'edit'} onChange={e => { setRowValue(e, index, 'productCode') }} value={text} placeholder='请输入产品编码' />
        },
        {
            title: '产品名称',
            dataIndex: 'productName',
            render: (text, record, index) => <Input onChange={e => { setRowValue(e, index, 'productName') }} value={text} placeholder='请输入产品名称' />
        },
    ]
    const rowSelection = {
        selectedRowKeys,
        onChange: rowskey => {
            setSelectedRowKeys(rowskey)
        }
    }
    return (
        <Fragment>
            <ProTable
                headerTitle="产品维护"
                toolBarRender={() => [
                        <Button onClick={setModalParams.bind(this, { type: 'add', visible: true })} type='primary'>新增</Button>
                ]}
                {...TABLE_CONFIG}
                actionRef={proTableRef}
                search={{ labelWidth: 'auto' }}
                request={async (params) => dealerStockProduct(params).then(res => handleProTableRes(res))}
                columns={columns}
            />
            <Modal
                width={800}
                getContainer={Container}
                title={`${modalParams.type == 'add' ? "新增" : '编辑'}产品`}
                onCancel={onCloseModal}
                confirmLoading={loading}
                onOk={onSaveFun}
                destroyOnClose
                visible={modalParams.visible}
            >
                <Row>
                    <Col span={24}>
                        {modalParams.type == 'add' && (
                            <Space style={{ marginBottom: '10px' }}>
                                <Button onClick={addRow} type='primary'>添加行</Button>
                                <Button onClick={deleteRow} disabled={modalParams.type == 'edit'} danger type='primary'>删除行</Button>
                            </Space>
                        )}
                    </Col>
                    <Col span={24}>
                        <Table
                            size='small'
                            dataSource={dataSource}
                            columns={formColumns}
                            scroll={{ y: 500 }}
                            rowKey='key'
                            pagination={false}
                            rowSelection={modalParams.type == 'add' ? rowSelection : false}
                        />
                    </Col>
                </Row>
            </Modal>
        </Fragment>)
    // 关闭弹窗
    function onCloseModal() {
        setModalParams({
            visible: false,
            type: ''
        });
        setSelectedRowKeys([])
        setDataSource([])
    }
    // 点击确定
    async function onSaveFun() {
        if (!dataSource.length) {
            message.error('请添加至少一行数据!')
            return
        }
        try {
            setLoading(true)
            let res = await saveProduct(dataSource);
            setLoading(false);
            onCloseModal();
            handleRes(res, proTableRef)
        } catch (err) { }
    }
    // 选择行数据
    function setRowValue(e, index, field) {
        let newData = cloneDeep(dataSource);
        newData[index][field] = e.target.value
        setDataSource(newData)
    }
    // 添加行数据
    function addRow() {
        let newData = cloneDeep(dataSource);
        let params = {
            key: uniqueId('PRODUCT_'),
            productCode: undefined,
            productName: undefined
        }
        newData.push(params);
        setDataSource(newData)
    }
    // 删除行数据
    function deleteRow() {
        if (!selectedRowKeys.length) return;
        let newData = dataSource.filter(v => !selectedRowKeys.some(m => m === v.key));
        setSelectedRowKeys([])
        setDataSource(newData)
    }
    // 删除
    async function deleteFun(id) {
        try {
            let res = await deleteProduct([id])
            handleRes(res, proTableRef)
        } catch (err) { }
    }
}
export default ProductMaintain