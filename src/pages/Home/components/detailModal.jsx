import React from 'react';
import {Modal, Button, Select} from 'antd';
import {ProTable} from '@ant-design/pro-components';
import {getDetails} from '../../BaseProduct/service';
import {Container} from '@/utils';

export default ({visible, setVisible, id}) => {
  const columns = [
    {title: '序号', dataIndex: 'index', valueType: 'index', width: 48, fixed: 'left'},
    {title: '产品基准价（元/瓶）', dataIndex: 'basePrice', search: false, width: 100},
    {title: '低于基准价范围（元/瓶）', dataIndex: 'lowerRange', search: false, width: 150},
    {
      title: '低于基准价百分比',
      dataIndex: 'lowerPercent',
      valueType: 'select',
      valueEnum: {
        all: {text: '全部', status: 'Default'},
        close: {text: '关闭', status: 'Default'},
        running: {text: '运行中', status: 'Processing'},
        online: {text: '已上线', status: 'Success'},
        error: {text: '异常', status: 'Error'},
      },
      width: 100,
    },
    {title: '有效开始时间', dataIndex: 'startDate', valueType: 'date', width: 150},
    {title: '有效结束时间', dataIndex: 'endDate', valueType: 'dateMonth', width: 150},
  ];

  const handleProTableRes = ({code, data}) => {
    return {
      success: code === '00000',
      total: 1,
      data: [data],
    };
  };
  return (
    <Modal
      width={1200}
      title="查看详情"
      visible={visible}
      destroyOnClose
      getContainer={Container}
      footer={[
        <Button onClick={setVisible.bind(this, false)} key="onCancel">
          关闭
        </Button>,
      ]}
      onCancel={setVisible.bind(this, false)}
    >
      <div>
        <div>
          <Select
            defaultValue="lucy"
            style={{
              width: 120,
            }}
          >
            <Option value="jack">Jack</Option>
            <Option value="lucy">Lucy</Option>
            <Option value="disabled" disabled>
              Disabled
            </Option>
            <Option value="Yiminghe">yiminghe</Option>
          </Select>
        </div>
        <ProTable
          search={true}
          headerTitle="提报详情"
          columns={columns}
          rowKey="id"
          revalidateOnFocus={false}
          pagination={false}
          options={{reload: false, density: true, fullScreen: true}}
          //   toolBarRender={false}
          request={async () => {
            return getDetails(id).then((res) => handleProTableRes(res));
          }}
        />
      </div>
    </Modal>
  );
};
