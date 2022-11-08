import React, { useState, useEffect } from 'react';
import { ProTable } from '@ant-design/pro-components';
import { queryAllPurchasers } from '../service';
import { message, Modal } from 'antd'
import { Container } from '@/utils/index';

function ChangeProduct({ visible, onCancel, onOk, rowId }) {
    const [selectedRow, setSelectedRow] = useState([])
    const rowSelection = {
        type: 'radio',
        selectedRowKeys: selectedRow.map(v => v.dealerCode),
        onChange: (keys, rows) => { setSelectedRow(rows) }
    }
    const columns = [
        { title: '序号', dataIndex: 'index', valueType: 'index', width: 48 },
        { title: '经销商编码', dataIndex: 'dealerCode', search: false },
        { title: '经销商名称', dataIndex: 'dealerName', search: false },
    ]
    useEffect(() => {
        if (!visible) {
            setSelectedRow([])
        }
    }, [visible])
    return (<Modal
        title='创建收货通知单'
        bodyStyle={{ padding: '12px' }}
        onCancel={onCancel}
        onOk={createFun}
        destroyOnClose
        width={800}
        getContainer={Container}
        visible={visible}
    >
        <ProTable
            options={false}
            headerTitle="选择经销商"
            rowSelection={rowSelection}
            search={false}
            params={{ forensicsIds: [rowId] }}
            pagination={false}
            tableAlertRender={false}
            revalidateOnFocus={false}
            rowKey="dealerCode"
            columns={columns}
            request={async params => queryAllPurchasers(params).then(({ code, data }) => {
                return {
                    success: code === '00000',
                    total: data?.length,
                    data
                }
            })}
        />
    </Modal>)
    function createFun() {
        if (!selectedRow.length) {
            message.error('请选择一条数据！')
            return
        }
        onOk(selectedRow)
    }
}

export default ChangeProduct