/*
 * @Author: wangrui
 * @Date: 2022-08-23 16:09:01
 * @LastEditors: wangrui
 * @Description:
 * @LastEditTime: 2022-09-08 09:12:08
 */

export const product_column = [
    { title: '产品信息', dataIndex: 'productName', valueType: 'text', align: 'center' },
    {
        title: '奖励金总额（元）',
        dataIndex: 'totalReward',
        valueType: 'digit',
        fieldProps: {
            precision: 2,
            style: { width: '100%' },
        },
        align: 'center',
    },
    {
        title: '倍数',
        dataIndex: 'multiple',
        valueType: 'digit',
        fieldProps: {
            precision: 0,
            style: { width: '100%' },
        },
        align: 'center',
    },
    {
        title: '取消奖励金（元）',
        dataIndex: 'cancelBonus',
        valueType: 'digit',
        fieldProps: {
            precision: 2,
            style: { width: '100%' },
        },
        align: 'center',
    },
    {
        title: '扣除保证金（元）',
        dataIndex: 'securityDeposit',
        valueType: 'digit',
        fieldProps: {
            precision: 2,
            style: { width: '100%' },
        },
        align: 'center',
    },
    {
        title: '提高结算价',
        dataIndex: 'settlementPrice',
        valueType: 'digit',
        fieldProps: {
            precision: 2,
            style: { width: '100%' },
        },
        align: 'center',
    },
    {
        title: '扣除销量（万元）',
        dataIndex: 'deductSales',
        valueType: 'digit',
        fieldProps: {
            precision: 2,
            style: { width: '100%' },
        },
        align: 'center',
    },
    {
        title: '扣除销量倍数',
        dataIndex: 'deductSalesMultiple',
        valueType: 'digit',
        fieldProps: {
            precision: 0,
            style: { width: '100%' },
        },
        align: 'center',
    },
    { title: '回收时间', dataIndex: 'fleeingReceivingDate', valueType: 'dateTime', align: 'center' },
    {
        title: '取证数量（瓶）',
        dataIndex: 'quantity',
        valueType: 'digit',
        fieldProps: {
            precision: 0,
            style: { width: '100%' },
        },
        align: 'center',
    },
    {
        title: '取证价格（元/瓶）',
        dataIndex: 'singlePrice',
        valueType: 'digit',
        fieldProps: {
            precision: 2,
            style: { width: '100%' },
        },
        align: 'center',
    },
    { title: '提货日期', dataIndex: 'deliveryDate', valueType: 'dateTime', align: 'center' },
    {
        title: '提货数量（箱）',
        dataIndex: 'quantityBox',
        valueType: 'digit',
        fieldProps: {
            precision: 0,
            style: { width: '100%' },
        },
        align: 'center',
    },
    {
        title: '总区域扫码率(%）',
        dataIndex: 'scanningRate',
        valueType: 'digit',
        fieldProps: {
            precision: 2,
            style: { width: '100%' },
        },
        align: 'center',
    },
];
