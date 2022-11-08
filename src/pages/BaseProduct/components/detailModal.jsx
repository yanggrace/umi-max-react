import React from 'react';
import { Modal, Button } from 'antd'
import { ProTable } from '@ant-design/pro-components';
import { getDetails } from '../service';
import { Container } from '@/utils';

export default ({ visible, setVisible, id }) => {
    const columns = [
        { title: '序号', dataIndex: 'index', valueType: 'index', width: 48, fixed: 'left' },
        { title: '产品基准价（元/瓶）', dataIndex: 'basePrice', search: false, width: 100 },
        { title: '低于基准价范围（元/瓶）', dataIndex: 'lowerRange', search: false, width: 150 },
        { title: '低于基准价百分比', dataIndex: 'lowerPercent', search: false, width: 100 },
        { title: '有效开始时间', dataIndex: 'startDate', search: false, width: 150 },
        { title: '有效结束时间', dataIndex: 'endDate', search: false, width: 150 }
    ]

    const handleProTableRes = ({ code, data }) => {
        return {
            success: code === '00000',
            total: data?.pricePeriods?.length,
            data: data.pricePeriods || []
        };
    }
    return (<Modal
        width={1200}
        title='查看详情'
        visible={visible}
        destroyOnClose
        getContainer={Container}
        footer={[<Button onClick={setVisible.bind(this, false)} key='onCancel'>关闭</Button>,]}
        onCancel={setVisible.bind(this, false)}
    >
        <ProTable
            search={false}
            headerTitle='提报详情'
            columns={columns}
            rowKey="id"
            revalidateOnFocus={false}
            pagination={false}
            options={{ reload: false }}
            toolBarRender={false}
            request={async () => {
                return getDetails(id).then(res => handleProTableRes(res))
            }}
        />
    </Modal>)
}