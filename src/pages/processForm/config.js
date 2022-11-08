/*
 * @Author: wangrui
 * @Date: 2022-08-29 09:00:16
 * @LastEditors: wangrui
 * @Description: 
 * @LastEditTime: 2022-09-22 17:37:10
 */
export const fromProps = (ref) => ({
    grid: true,
    layout: 'horizontal',
    formRef: ref,
    labelWrap: true,
    labelCol: { span: 6 },
    colProps: { span: 8 },
    submitter: false,
    autoFocusFirstInput: false
})

export const enumsBoolean = [
    { label: '是', value: 1, key: 1 },
    { label: '否', value: 0, key: 0 }
]
export const enumsBoolean2 = [
    { label: '是', value: true, key: true },
    { label: '否', value: false, key: false }
]
export const enumsUnit = [
    { label: '箱', value: 1 },
    { label: '瓶', value: 0 }
]
export const productType = [
    { label: '商超', value: '商超' },
    { label: '团购', value: '团购' },
    { label: '酒店', value: '酒店' },
]
export const channelEnums = [
    { label: '商超', value: '商超' },
    { label: '团购', value: '团购' },
    { label: '酒店', value: '酒店' },
    { label: '网络', value: '网络' },
]