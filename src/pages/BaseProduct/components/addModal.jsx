import React, { useRef, useState, useEffect } from 'react';
import { Button, Modal, Select, Row, Col, Form, InputNumber, DatePicker, Space, Table, message} from 'antd'
import { getCategoryList, getNextList, getProvince, getCity, addRecord, getProductCodeList, getDetails, editRecord  } from '../service'
import { Container, handleRes } from '@/utils';
import { uniqueId, cloneDeep, debounce } from 'lodash';
import { SUCCESS_CODE } from '@/constants';
import moment from 'moment';

const { Option } = Select;
const debounceFun = debounce((func, params, formParams, e) => { func(params, formParams,e) }, 500);

export default ({ visible, setVisible, id, actionRef, isAdd }) => {

    const [addForm] = Form.useForm();

    const [categoryOption, setCategoryOption] = useState([]); // 品类下拉框
    const [brandOption, setBranchOption] = useState([]); // 品牌的下拉框
    const [seriesOption, setSeriesOption] = useState([]); // 系列的下拉框
    const [bigLevelOption, setBigLevelOption] = useState([]); // 大类下拉框
    const [smallLevelOption, setSmallLevelOption] = useState([]); // 小类下拉框
    const [productOption, setProductOption] = useState([]); // 产品编码的下拉框

    const [provinceOption, setProvinceOption] = useState([]); // 省份下拉框
    const [cityOption, setCityOption] = useState([]); // 市区下拉框

    const [maxRange, setMaxRange] = useState(0); // 最大范围
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [dataSource, setDataSource] = useState([]); // table 数据
    const [tableMaxRange, setTableMaxRange] = useState([0]);
    const [detailsData, setDetailsData] = useState({});
    const [confirmLoading, setConfirmLoading] = useState(false);

    const formColumns = [
        {
            title: '序号',
            dataIndex: 'index',
            width: 60,
            render: (text, record, index) => (<span>{index + 1}</span>)
        },
        {
            title: '产品基准价',
            dataIndex: 'basePrice',
            render: (text, record, index) =>
            (<InputNumber defaultValue={text} style={{width: '100%'}} min={0} onChange={(e) => {
                let newMax = cloneDeep(tableMaxRange);
                newMax[index] = e;
                setTableMaxRange(newMax);
                rowChange(e, index, 'basePrice')
            }} placeholder="请输入基准价（元/瓶）" />)
        },
        {
            title: '结算价',
            dataIndex: 'settlePrice',
            render: (text, record, index) =>
            (<InputNumber defaultValue={text} style={{width: '100%'}} min={0} placeholder="请输入结算价" 
                onChange={(e) => {
                rowChange(e, index, 'settlePrice')
            }}/>)
        },
        {
            title: '低于基准价百分比',
            dataIndex: 'lowerPercent',
            render: (text, record, index) =>
            (<InputNumber defaultValue={text} style={{width: '100%'}} min={0} max={100} placeholder="请输入低于基准价百分比" onChange={(e) => {
                rowChange(e, index, 'lowerPercent')
            }} />)
        }, {
            title: '低于基准价范围',
            dataIndex: 'lowerRange',
            render: (text, record, index) =>
            (<InputNumber defaultValue={text} style={{width: '100%'}} min={0} max={tableMaxRange} 
                placeholder="请输入结算价" onChange={(e) => {
                rowChange(e, index, 'lowerRange')
            }} />)
        }, {
            title: '有效开始时间',
            dataIndex: 'startDate',
            render: (text, record, index) =>
            (<DatePicker
                disabledDate={(e) => e && e < moment().subtract(1, 'day')}
                style={{ width: '100%' }}
                value={text ? moment(text) : undefined}
                onChange={e => { rowChange(e, index, 'startDate') }}
                placeholder='请选择有效开始时间' />)
        }, {
            title: '有效结束时间', // (e) => e && e < moment().subtract(1, 'day')
            dataIndex: 'endDate',
            render: (text, record, index) =>
            (<DatePicker
                disabledDate={(e) => e && e < moment(record.startDate)}
                style={{ width: '100%' }}
                value={text ? moment(text) : undefined}
                onChange={e => { rowChange(e, index, 'endDate') }}
                placeholder='请选择有效结束时间' />)
        }
    ]

    useEffect(() => {
        getCategoryOption();
        getProvinceOption();
        initData();
    }, [])

    // 初始化数据
    const initData = () => {
        if (!isAdd) { // 编辑的情况， 获取编辑的数据
            initEditData();
        }
    }

    const initEditData = async () => {
        let {code, data} = await getDetails(id);
        if (code === SUCCESS_CODE) {
            setDetailsData(data);
            let params = {};
            params.categoryData = {value: data.categoryCode, key: data.categoryCode, label: data.categoryName};
            params.brandData = {value: data.brandCode, key: data.brandCode, label: data.brandName};
            params.seriesData = {value: data.seriesCode, key: data.seriesCode, label: data.seriesName};
            params.bigLevelData = {value: data.bigLevelCode, key: data.bigLevelCode, label: data.bigLevelName};
            params.smallLevelData = {value: data.smallLevelCode, key: data.smallLevelCode, label: data.smallLevelName};
            params.productData = {value: data.productCode, key: data.productCode, label: data.productName};
            params.provinceData = {value: data.provinceCode, key: data.provinceCode, label: data.provinceName};
            params.cityData = {value: data.cityCode, key: data.cityCode, label: data.cityName};

            // 初始化下拉框数据
            initSelectOption(data);

            // 初始化table 表格中的最大值
            data?.pricePeriods?.length && data.pricePeriods.forEach((item, index) => {
                let newMaxRange = cloneDeep(tableMaxRange);
                newMaxRange[index] = item.basePrice;
                setTableMaxRange(newMaxRange);
            })

            setMaxRange(data.basePrice);
            console.log('1111111', {...data, ...params});
            addForm.setFieldsValue({...data, ...params});
            setDataSource(data.pricePeriods);
        }
    }

    const initSelectOption = async (data) => {
        let nextCode = [{
                code: data.categoryCode, setFun: setBranchOption
            }, {
                code: data.brandCode, setFun: setSeriesOption
            },{
                code: data.seriesCode, setFun: setBigLevelOption
            },{
                code: data.bigLevelCode, setFun: setSmallLevelOption
        },];
        let index = 0;
        do {
            getNextOption(nextCode[index].code, nextCode[index].setFun);
            index ++;
        } while (index < nextCode.length)
        // 市级下拉框
        getCityList(data.provinceCode);

        // 产品编码下拉框
        getProductOption({
            bigLevelCode: data.bigLevelCode,
            brandCode: data.brandCode,
            categoryCode: data.categoryCode,
            seriesCode: data.seriesCode,
            smallLevelCode: data.smallLevelCode,
            productCodeOrName: '',
            current: 1,
            size: 100
        });
    }

    function rowChange(e, index, filed) {
        let newData = cloneDeep(dataSource);
        if (['startDate', 'endDate'].includes(filed)) {
            newData[index][filed] = e ? e.format('YYYY-MM-DD') : undefined;
        } else {
            newData[index][filed] = e
        }
        setDataSource(newData)
    }

    // 获取省份下拉框
    const getProvinceOption = async () => {
        let { data } = await getProvince();
        setProvinceOption(data || []);
    }

    // 获取市区下拉框
    const getCityList = async (e, formParams) => {
        if (formParams) {
            let values = addForm.getFieldsValue();
            addForm.setFieldsValue({...values, ...formParams});
        }
        let { data } = await getCity(e);
        setCityOption(data || []);
    }

    // 获取品类的下拉菜单
    const getCategoryOption = async () => {
        let { data } = await getCategoryList();
        setCategoryOption(data || []);
    }

    // 获取下一级的下拉框
    const getNextOption = async (code, setFun, formParams) => {
        // debugger;
        if (formParams) {
            let values = addForm.getFieldsValue();
            console.log({...values, ...formParams});
            addForm.setFieldsValue({...values, ...formParams});
        }
        let {data} = await getNextList(code);
        setFun(data);
    }

    // 获取产品编码的下拉框
    const getProductOption = async (params, formParams, selectValue) => {
        let values = addForm.getFieldsValue();

        // 切换品类品牌等 产品编码为空；
        if (formParams) {
            addForm.setFieldsValue({...values, ...formParams});
        }
        let searchParams = cloneDeep(params);
        if (!params) {
            let {bigLevelData, brandData, categoryData, seriesData, smallLevelData, productData} = values || {};
            if (!brandData?.value || !categoryData?.value || !seriesData?.value) {
                return;
            }

            searchParams = {
                bigLevelCode: bigLevelData?.value,
                brandCode: brandData?.value,
                categoryCode: categoryData?.value,
                seriesCode: seriesData?.value,
                smallLevelCode: smallLevelData?.value,
                productCodeOrName: selectValue || productData?.value, // 搜索的时候按照搜索框中的值
                current: 1,
                size: 100
            };
        }
        let {data} = await getProductCodeList(searchParams);
        setProductOption(data.records || []);
    }

    const rowSelection = {
        selectedRowKeys,
        onChange: rowskey => {
            setSelectedRowKeys(rowskey)
        }
    }

    // 新增table的行
    const addRow = () => {
        let newData = cloneDeep(dataSource);
        let params = {
            id: uniqueId(),
            basePrice: undefined,
            settlePrice: undefined,
            lowerPercent: undefined,
            lowerRange: undefined,
            startDate: undefined,
            endDate: undefined
        }
        newData.push(params);
        setDataSource(newData)
    }

    // 删除table的行
    const deleteRow = () => {
        if (!selectedRowKeys.length) {
            message.error('请选择要删除的选项')
            return
        };
        let newData = dataSource.filter(v => !selectedRowKeys.some(m => m === v.id));
        setSelectedRowKeys([])
        setDataSource(newData)
    }
    
    // 处理需要提交上库的数据
    const handleSaveData = () => {
        let values = addForm.getFieldsValue();

        console.log('values', values);
        let mapValue = {
            categoryData: ['categoryCode', 'categoryName'],
            brandData: ['brandCode', 'brandName'],
            seriesData: ['seriesCode', 'seriesName'],
            bigLevelData: ['bigLevelCode', 'bigLevelName'],
            smallLevelData: ['smallLevelCode', 'smallLevelName'],
            productData: ['productCode', 'productName'],
            provinceData: ['provinceCode', 'provinceName'],
            cityData: ['cityCode', 'cityName'],
        };
        let revertArr = ['categoryData', 'brandData', 'seriesData', 'bigLevelData', 'smallLevelData', 'productData', 'provinceData', 'cityData'];
        let newValues = {};
        for (let key in values) {
            if (revertArr.includes(key)) {
                for (let mapKey in mapValue) {
                    if (mapKey === key) {
                        newValues[mapValue[mapKey][0]] = values[key]?.value ? values[key].value : '';
                        newValues[mapValue[mapKey][1]] = values[key]?.label ? values[key].label : '';
                    }
                }
            }
        }
        let {basePrice, settlePrice, lowerPercent, lowerRange} = values;
        return {
            ...newValues,
            basePrice,
            settlePrice,
            lowerPercent,
            lowerRange,
            pricePeriods: cloneDeep(dataSource)
        };
    }

    const handleTableMsg = (data) => {
        if (!data?.pricePeriods?.length) {
            return {flag: true}; // 不需要进行校验提示
        }
        for (let i= 0; i < data.pricePeriods.length; i++) {
            if (!data.pricePeriods[i].basePrice) { // 表格中数据为空
                return {flag: false, msg: '表格中的基准价不能为空'};
            }

            if (!data.pricePeriods[i].startDate || !data.pricePeriods[i].endDate) {
                return {flag: false, msg: '开始时间和结束时间不能为空'};
            }

            for (let j = i + 1; j < data.pricePeriods.length; j++) {
                if (moment(data.pricePeriods[j].startDate) >= moment(data.pricePeriods[i].startDate) && moment(data.pricePeriods[j].endDate) <= moment(data.pricePeriods[i].endDate)) {
                    return {flag: false, msg: '表格中各项的开始时间结束时间不能交叉'};
                }
            }
        }
        return {flag: true};
    }

    const handleSaveTips = (data) => {
        if (!data.categoryCode) {
            return { flag: true, msg: '品类不能为空' }
        } else if(!data.brandCode) {
            return { flag: true, msg: '品牌不能为空' }
        } else if(!data.seriesCode) {
            return { flag: true, msg: '系列不能为空' }
        } else if(!data.productCode) {
            return { flag: true, msg: '产品名称不能为空' }
        } else if(!data.provinceCode) {
            return { flag: true, msg: '省份不能为空' }
        } else if (!data.basePrice) {
            return { flag: true, msg: '表单中基准价不能为空' }
        } else if (!handleTableMsg(data).flag) {
            return { flag: true, msg: handleTableMsg(data).msg }
        } else {
            return { flag: false }
        }
    }

    // 整体数据保存
    const onSave = async () => {
        let valueParams = handleSaveData();
        if (!isAdd) { // 编辑的情况
            valueParams = cloneDeep({...detailsData, ...valueParams});
        }

        // 对数据进行校验
        let tipsRes = handleSaveTips(valueParams);
        if (tipsRes.flag) {
            message.info(tipsRes.msg);
            return;
        }
        setConfirmLoading(true);
        let res = isAdd ? await addRecord(valueParams) : await editRecord(valueParams);
        setConfirmLoading(false);
        let flag = handleRes(res, actionRef);
        if (flag) {
            setVisible(false);
        }
    }

    return (<Modal
        width={1200}
        title={isAdd ? '新增产品基准价格': '编辑产品基准价格'}
        visible={visible}
        destroyOnClose
        getContainer={Container}
        confirmLoading={confirmLoading}
        onCancel={setVisible.bind(this, false)}
        onOk={onSave}
    >
        <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            name="addForm"
            form={addForm}
            labelWrap
        >
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        label="品类"
                        name="categoryData"
                        rules={[{ required: true, message: '请选择品类' }]}
                    >
                        <Select
                            allowClear
                            showSearch
                            labelInValue
                            placeholder='请选择品类'
                            optionFilterProp="children"
                            defaultActiveFirstOption={false}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            onChange={(e) => {
                                getNextOption(e.value, setBranchOption, {
                                    brandData: {value: undefined, label: undefined, key: undefined},
                                    seriesData: {value: undefined, label: undefined, key: undefined},
                                    bigLevelData: {value: undefined, label: undefined, key: undefined},
                                    smallLevelData: {value: undefined, label: undefined, key: undefined}
                                });
                                getProductOption(undefined, {
                                    productData: {value: undefined, label: undefined, key: undefined}
                                });
                            }}
                        >
                            {categoryOption.map(d => <Option key={d.levelCode}>{d.levelName}</Option>)}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="品牌"
                        name="brandData"
                        rules={[{ required: true, message: '请选择品牌' }]}
                    >
                        <Select
                            allowClear
                            showSearch
                            labelInValue
                            placeholder='请选择品牌'
                            optionFilterProp="children"
                            defaultActiveFirstOption={false}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            onChange={(e) => {
                                getNextOption(e.value, setSeriesOption, {
                                    seriesData: {value: undefined, label: undefined, key: undefined},
                                    bigLevelData: {value: undefined, label: undefined, key: undefined},
                                    smallLevelData: {value: undefined, label: undefined, key: undefined}
                                });
                                getProductOption(undefined,{
                                    productData: {value: undefined, label: undefined, key: undefined}
                                });
                            }}
                        >
                            {brandOption.map(d => <Option key={d.levelCode}>{d.levelName}</Option>)}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="系列"
                        name="seriesData"
                        rules={[{ required: true, message: '请选择系列' }]}
                    >
                        <Select
                            allowClear
                            showSearch
                            labelInValue
                            placeholder='请选择系列'
                            optionFilterProp="children"
                            defaultActiveFirstOption={false}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            onChange={(e) => {
                                getNextOption(e.value, setBigLevelOption, {
                                    bigLevelData: {value: undefined, label: undefined, key: undefined},
                                    smallLevelData: {value: undefined, label: undefined, key: undefined}
                                });
                                getProductOption(undefined,{
                                    productData: {value: undefined, label: undefined, key: undefined}
                                });
                            }}
                        >
                            {seriesOption.map(d => <Option key={d.levelCode}>{d.levelName}</Option>)}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        label="大类"
                        name="bigLevelData"
                    >
                        <Select
                            allowClear
                            showSearch
                            labelInValue
                            placeholder='请选择大类'
                            optionFilterProp="children"
                            defaultActiveFirstOption={false}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            onChange={(e) => {
                                getNextOption(e.value, setSmallLevelOption, {
                                    smallLevelData: {value: undefined, label: undefined, key: undefined}
                                });
                                getProductOption(undefined,{
                                    productData: {value: undefined, label: undefined, key: undefined}
                                });
                             }}
                        >
                            {bigLevelOption.map(d => <Option key={d.levelCode}>{d.levelName}</Option>)}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="细类"
                        name="smallLevelData"
                    >
                        <Select
                            allowClear
                            showSearch
                            labelInValue
                            placeholder='请选择细类'
                            optionFilterProp="children"
                            defaultActiveFirstOption={false}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            onChange={(e) => {
                                getProductOption(undefined,{
                                    productData: {value: undefined, label: undefined, key: undefined}
                                });
                             }}
                        >
                            {smallLevelOption.map(d => <Option key={d.levelCode}>{d.levelName}</Option>)}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="产品名称"
                        name="productData"
                        rules={[{ required: true, message: '请选择产品名称' }]}
                    >
                        <Select
                            allowClear
                            showSearch
                            labelInValue
                            placeholder='请选择产品名称'
                            defaultActiveFirstOption={false}
                            filterOption={false}
                            onSearch={e => { debounceFun(getProductOption, undefined, undefined, e) }}
                        >
                            {productOption.map(d => <Option key={d.productCode}>{d.productName}</Option>)}
                        </Select>
                    </Form.Item>
                </Col>
            </Row>

            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        label="省"
                        name="provinceData"
                        rules={[{ required: true, message: '请选择省' }]}
                    >
                        <Select
                            allowClear
                            showSearch
                            labelInValue
                            placeholder='请选择省'
                            optionFilterProp="children"
                            defaultActiveFirstOption={false}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                            onChange={(e) => { getCityList(e.value, {
                                cityData: {value: undefined, label: undefined, key: undefined}
                            }) }}
                        >
                            {provinceOption.map(d => <Option key={d.code}>{d.name}</Option>)}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="市"
                        name="cityData"
                    >
                        <Select
                            allowClear
                            showSearch
                            labelInValue
                            placeholder='请选择市'
                            optionFilterProp="children"
                            defaultActiveFirstOption={false}
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {cityOption.map(d => <Option key={d.code}>{d.name}</Option>)}
                        </Select>
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="基准价"
                        name="basePrice"
                        rules={[{ required: true, message: '请选择基准价' }]}
                    >
                        <InputNumber style={{width: '100%'}} min={0} onChange={(e) => {console.log(e);setMaxRange(e)}} placeholder="请输入基准价" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item
                        label="结算价"
                        name="settlePrice"
                    >
                        <InputNumber style={{width: '100%'}} min={0} placeholder="请输入结算价" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="低于基准价百分比"
                        name="lowerPercent"
                    >
                        <InputNumber style={{width: '100%'}} min={0} max={100} placeholder="请输入低于基准价百分比" />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        label="低于基准价范围"
                        name="lowerRange"
                    >
                        <InputNumber style={{width: '100%'}} min={0} max={maxRange} placeholder="请输入结算价" />
                    </Form.Item>
                </Col>
            </Row>

            <Row>
                <Col span={24}>
                    <Space>
                        <Button onClick={addRow} type='primary'>添加行</Button>
                        <Button onClick={deleteRow} danger type='primary'>删除行</Button>
                    </Space>
                </Col>
                <Col span={24} style={{marginTop: '24px'}}>
                    <Table
                        size='small'
                        dataSource={dataSource}
                        columns={formColumns}
                        scroll={{ y: 500 }}
                        rowKey='id'
                        pagination={false}
                        rowSelection={rowSelection}
                    />
                </Col>
            </Row>
        </Form>
    </Modal>)
}