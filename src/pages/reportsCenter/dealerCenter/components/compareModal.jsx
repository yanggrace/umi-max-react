import React from 'react';
import { Modal } from 'antd'
import { Container } from '@/utils/index';
import { ProTable } from '@ant-design/pro-components';
import { getContrastDetail } from '../service';
import { cloneDeep } from 'lodash';

function CompareModal({ visible, setVisible, curRecord, getWeek }) {
    const columns = [
        { title: '序号', dataIndex: 'index', valueType: 'index', width: 48, fixed: 'left' },
        // { title: '事业部', dataIndex: 'regionName', search: false, width: 100 },
        // { title: '分办', dataIndex: 'branchName', search: false, width: 100 },
        { title: '经销商编码', dataIndex: 'dealerCode', search: false, width: 100 },
        { title: '经销商名称', dataIndex: 'dealerName', search: false, width: 150 },
        { title: '产品编码', dataIndex: 'productCode', search: false, width: 100 },
        { title: '产品名称', dataIndex: 'productName', search: false, width: 150 },
        { title: '库存金额（万元）', dataIndex: 'stockAmount', search: false, width: 150 },
        { title: '库存量', dataIndex: 'stockNum', search: false, width: 100 },
        { title: '提报日期', dataIndex: 'createDate', search: false, width: 150 },
        { title: '截至日期', dataIndex: 'endDate', search: false, width: 150 },
        { title: '填报人', dataIndex: 'createName', search: false, width: 150 },
    ]
    return (<Modal
        width={1200}
        title='查看详情'
        visible={visible}
        destroyOnClose
        getContainer={Container}
        footer={false}
        onCancel={setVisible.bind(this, false)}
    >
        <ProTable
            search={false}
            options={{ reload: false }}
            headerTitle='提报详情'
            params={curRecord}
            columns={columns}
            scroll={{ y: columns.reduce((m, n) => (m + n.width), 0) }}
            rowKey="id"
            revalidateOnFocus={false}
            request={async params => {
                let newParams = cloneDeep(params);
                let week = getWeek()
                if (week) {
                    week = week.split(' ~ ');
                    newParams.weekStartDate = week[0];
                    newParams.weekEndDate = week[1];
                }
                return getContrastDetail(newParams).then(res => handleProTableRes(res))
            }}
        />
    </Modal>)
    function handleProTableRes({ code, data }) {
        return {
            success: code === '00000',
            total: data?.length,
            data
        };
    }
}

export default CompareModal