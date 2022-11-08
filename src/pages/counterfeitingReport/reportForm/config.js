/*
 * @Author: wangrui
 * @Date: 2022-08-18 19:04:19
 * @LastEditors: wangrui
 * @Description: 表单配置
 * @LastEditTime: 2022-08-19 09:06:05
 */
// 举报人信息
import { getArea } from './service'
const sexEnums = [{ label: '男', value: '男' }, { label: '女', value: '女' }];
const formItemProps = () => ({ rules: [{ required: true, message: '此项为必填项' }] });
export const BooleanEnums = [{ label: '是', value: true }, { label: '否', value: false }];
export const fromProps = (ref) => ({
    grid: true,
    layout: 'horizontal',
    formRef: ref,
    labelWrap: true,
    labelCol: { span: 6 },
    colProps: { span: 8 },
    submitter: false
})

// 涉案人员
export const columns_suspect = [
    { title: '序号', dataIndex: 'index', valueType: 'index', fixed: 'left', width: 48 },
    {
        title: '姓名',
        dataIndex: 'name',
        width: 150,
        fixed: 'left',
        formItemProps
    },
    {
        title: '性别',
        dataIndex: 'sex',
        width: 150,
        valueType: 'select',
        formItemProps,
        request: () => sexEnums
    },
    {
        title: '出生日期',
        width: 200,
        dataIndex: 'birth',
        valueType: 'date',
        formItemProps,
        fieldProps: { style: { width: '100%' } }
    },
    {
        title: '籍贯',
        width: 250,
        valueType: 'cascader',
        dataIndex: 'nativePlace',
        formItemProps,
        fieldProps: {
            showSearch: true,
            fieldNames: { label: 'name', value: 'name', children: 'childRegions' },
        },
        request: () => getArea().then((res) => res.data)
    },
    {
        title: '住址',
        width: 250,
        dataIndex: 'address',
        formItemProps,
    },
    { title: '手机号', width: 250, dataIndex: 'phone', formItemProps },
    { title: '身份证号', width: 250, dataIndex: 'registrationCode', formItemProps },
    { title: '操作', valueType: 'option', width: 80 },
]
// 案件跟进信息
export const columns_progress = [
    { title: '序号', dataIndex: 'index', valueType: 'index', width: 48, fixed: 'left', },
    { title: '涉案人员姓名', fixed: 'left', formItemProps, dataIndex: 'name' },
    {
        title: '被判刑人信息',
        dataIndex: 'information',
        valueType: 'textarea',
        formItemProps,
        fieldProps: { autoSize: true }
    },
    {
        title: '刑期',
        dataIndex: 'term',
        valueType: 'date',
        formItemProps,
        fieldProps: { style: { width: '100%' } }
    },
    {
        title: '备注',
        dataIndex: 'remarks',
        valueType: 'textarea',
        fieldProps: { autoSize: true }
    },
    { title: '操作', valueType: 'option', width: 80 },
]