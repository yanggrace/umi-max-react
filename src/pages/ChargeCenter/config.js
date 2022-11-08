
export const errColumn = [
    {
        title: '行号',
        align: 'center',
        dataIndex: 'rowNum',
        width: '80px',
    },
    {
        title: '失败人员编码',
        align: 'center',
        dataIndex: 'userName',
    },
    {
        title: '失败原因',
        align: 'center',
        dataIndex: 'errMsg',
    },
]
export const okColumn = [
    {
        title: '行号',
        align: 'center',
        dataIndex: 'index',
        width: '80px',
        render: (text, record, index) => index + 1,
    },
    {
        title: '类型',
        align: 'center',
        dataIndex: 'typeName',
    },
    {
        title: '渠道',
        align: 'center',
        dataIndex: 'channelName',
    },
    {
        title: '省',
        align: 'center',
        dataIndex: 'provinceName',
    },
    {
        title: '市',
        align: 'center',
        dataIndex: 'cityName',
    },
    {
        title: '人员',
        align: 'center',
        dataIndex: 'userName',
    },
]