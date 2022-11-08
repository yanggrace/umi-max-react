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
        title: '区',
        align: 'center',
        dataIndex: 'areaName',
    },
    {
        title: '事业部',
        align: 'center',
        dataIndex: 'regionName',
    },
    {
        title: '人员',
        align: 'center',
        dataIndex: 'userName',
    },
]