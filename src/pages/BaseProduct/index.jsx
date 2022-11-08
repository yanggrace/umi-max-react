import React, {Fragment, useRef, useState, useEffect} from 'react';
import {Button, message, Popconfirm} from 'antd';
import {getBaseProductList, getCategoryList, getNextList, getProvince, getCity, deleteRecord} from './service';
import {ProTable} from '@ant-design/pro-components';
import {handleProTableRes, handleRes} from '@/utils/index';
import AddModal from './components/addModal';
import DetailModal from './components/detailModal';
import {Container} from '@/utils';
import {TABLE_CONFIG} from '@/constants';

export default () => {
  const proTableRef = useRef();
  const proActionRef = useRef();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 选择的值
  const [modalVisible, setModalVisible] = useState(false); // 新建跟编辑的弹窗
  const [detailModalVisible, setDetailModalVisible] = useState(false); // 查看详情的弹窗

  const [categoryOption, setCategoryOption] = useState([]); // 品类下拉框
  const [brandOption, setBranchOption] = useState([]); // 品牌的下拉框
  const [seriesOption, setSeriesOption] = useState([]); // 系列的下拉框
  const [bigLevelOption, setBigLevelOption] = useState([]); // 大类下拉框
  const [smallLevelOption, setSmallLevelOption] = useState([]); // 小类下拉框

  const [provinceOption, setProvinceOption] = useState([]); // 省份下拉框
  const [cityOption, setCityOption] = useState([]); // 市区下拉框

  const [curId, setCurId] = useState(''); // 查看详情当前选中的id值
  const [editId, setEditId] = useState(''); // 编辑时候当前选中的id值
  const [isAddModal, setIsAdd] = useState(true); // 新增获编辑产品基准价格

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      fixed: 'left',
      width: 48,
    },
    {
      title: '品类',
      key: 'categoryCode',
      dataIndex: 'categoryCode',
      fixed: 'left',
      width: 150,
      valueType: 'select',
      fieldProps: {
        options: categoryOption,
        fieldNames: {label: 'levelName', value: 'levelCode'},
        showSearch: true,
        filterOption: (inputValue, option) => option.levelName.includes(inputValue),
        onChange: (e) => {
          getNextOption(e, setBranchOption, {
            brandCode: undefined,
            seriesCode: undefined,
            bigLevelCode: undefined,
            smallLevelCode: undefined,
          });
        },
      },
    },
    {
      title: '品牌',
      key: 'brandCode',
      dataIndex: 'brandCode',
      fixed: 'left',
      width: 150,
      valueType: 'select',
      fieldProps: {
        options: brandOption,
        fieldNames: {label: 'levelName', value: 'levelCode'},
        showSearch: true,
        filterOption: (inputValue, option) => option.levelName.includes(inputValue),
        onChange: (e) => {
          getNextOption(e, setSeriesOption, {
            seriesCode: undefined,
            bigLevelCode: undefined,
            smallLevelCode: undefined,
          });
        },
      },
      render: (text, record) => <span>{record.brandName}</span>,
    },
    {
      title: '系列',
      key: 'seriesCode',
      dataIndex: 'seriesCode',
      width: 150,
      valueType: 'select',
      fieldProps: {
        options: seriesOption,
        fieldNames: {label: 'levelName', value: 'levelCode'},
        showSearch: true,
        filterOption: (inputValue, option) => option.levelName.includes(inputValue),
        onChange: (e) => {
          getNextOption(e, setBigLevelOption, {bigLevelCode: undefined, smallLevelCode: undefined});
        },
      },
      render: (text, record) => <span>{record.seriesName}</span>,
    },
    {
      title: '大类',
      key: 'bigLevelCode',
      dataIndex: 'bigLevelCode',
      fixed: 'left',
      width: 150,
      valueType: 'select',
      fieldProps: {
        options: bigLevelOption,
        fieldNames: {label: 'levelName', value: 'levelCode'},
        showSearch: true,
        filterOption: (inputValue, option) => option.levelName.includes(inputValue),
        onChange: (e) => {
          getNextOption(e, setSmallLevelOption, {smallLevelCode: undefined});
        },
      },
      render: (text, record) => <span>{record.bigLevelName}</span>,
    },
    {
      title: '细类',
      key: 'smallLevelCode',
      dataIndex: 'smallLevelCode',
      width: 150,
      valueType: 'select',
      fieldProps: {
        options: smallLevelOption,
        fieldNames: {label: 'levelName', value: 'levelCode'},
        showSearch: true,
        filterOption: (inputValue, option) => option.levelName.includes(inputValue),
      },
      render: (text, record) => <span>{record.smallLevelName}</span>,
    },
    {
      title: '产品编码',
      key: 'productCode',
      dataIndex: 'productCode',
      hideInSearch: true,
      width: 150,
    },
    {
      title: '产品名称',
      key: 'productName',
      dataIndex: 'productName',
      width: 150,
    },
    {
      title: '省',
      key: 'provinceCode',
      dataIndex: 'provinceCode',
      width: 150,
      valueType: 'select',
      fieldProps: {
        options: provinceOption,
        fieldNames: {label: 'name', value: 'code'},
        showSearch: true,
        filterOption: (inputValue, option) => option.name.includes(inputValue),
        onChange: (e) => {
          getCityList(e);
        },
      },
    },
    {
      title: '市',
      key: 'cityCode',
      dataIndex: 'cityCode',
      width: 150,
      valueType: 'select',
      fieldProps: {
        options: cityOption,
        fieldNames: {label: 'name', value: 'code'},
        showSearch: true,
        filterOption: (inputValue, option) => option.name.includes(inputValue),
      },
      render: (text, record) => <span>{record.cityName}</span>,
    },
    {
      title: '低于基准价百分比',
      key: 'lowerPercent',
      dataIndex: 'lowerPercent',
      hideInSearch: true,
      width: 150,
    },
    {
      title: '低于基准价范围（元/瓶）',
      key: 'lowerRange',
      dataIndex: 'lowerRange',
      hideInSearch: true,
      width: 150,
    },
    {
      title: '基准价（元/瓶）',
      key: 'basePrice',
      dataIndex: 'basePrice',
      hideInSearch: true,
      width: 150,
    },
    {
      title: '结算价（元/瓶）',
      key: 'settlePrice',
      dataIndex: 'settlePrice',
      hideInSearch: true,
      width: 150,
    },
    {
      title: '创建人',
      key: 'createName',
      dataIndex: 'createName',
      hideInSearch: true,
      width: 150,
    },
    {
      title: '创建时间',
      key: 'createDate',
      dataIndex: 'createDate',
      hideInSearch: true,
      width: 150,
    },
    {
      title: '最近修改人',
      key: 'modifyName',
      dataIndex: 'modifyName',
      hideInSearch: true,
      width: 150,
    },
    {
      title: '最近修改时间',
      key: 'modifyDate',
      dataIndex: 'modifyDate',
      hideInSearch: true,
      width: 150,
    },
    {
      title: '操作',
      key: 'operate',
      dataIndex: 'operate',
      hideInSearch: true,
      fixed: 'right',
      width: 150,
      render: (text, record, _, action) => [
        <a
          onClick={() => {
            console.log(record);
            setCurId(record.id);
            setDetailModalVisible(true);
          }}
          key="detail"
        >
          查看详情
        </a>,
      ],
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (rowskey) => {
      console.log('rowskey', rowskey);
      setSelectedRowKeys(rowskey);
    },
  };
  useEffect(() => {
    getCategoryOption();
    getProvinceOption();
  }, []);

  // 获取省份下拉框
  const getProvinceOption = async () => {
    let {data} = await getProvince();
    setProvinceOption(data || []);
  };

  // 获取市区下拉框
  const getCityList = async (e) => {
    proTableRef.current.setFieldsValue({cityCode: undefined});
    let {data} = await getCity(e);
    setCityOption(data || []);
  };

  // 获取品类的下拉菜单
  const getCategoryOption = async () => {
    let {data} = await getCategoryList();
    setCategoryOption(data || []);
  };

  // 获取下一级的下拉框
  const getNextOption = async (code, setFun, formParams) => {
    if (formParams) {
      proTableRef.current.setFieldsValue(formParams);
    }
    let {data} = await getNextList(code);
    setFun(data);
  };
  return (
    <Fragment>
      <ProTable
        formRef={proTableRef}
        actionRef={proActionRef}
        headerTitle="产品基准价格维护"
        {...TABLE_CONFIG}
        scroll={{x: 1600}}
        toolBarRender={() => [
          <Button
            onClick={() => {
              setModalVisible(true);
              setIsAdd(true);
            }}
            type="primary"
          >
            新增
          </Button>,
          <Button
            onClick={() => {
              if (selectedRowKeys.length !== 1) {
                message.info('请选择一项进行编辑');
                return;
              }
              setModalVisible(true);
              setIsAdd(false);
              setEditId(selectedRowKeys[0]);
            }}
            type="primary"
          >
            编辑
          </Button>,
          <Popconfirm
            title="确定删除？"
            onConfirm={async () => {
              if (selectedRowKeys.length === 0) {
                message.error('请选择要删除的产品');
                return;
              }
              try {
                let res = await deleteRecord(selectedRowKeys);
                setSelectedRowKeys([]);
                handleRes(res, proActionRef);
              } catch (err) {}
            }}
            placement="topLeft"
            okText="是"
            cancelText="否"
          >
            <Button type="danger">删除</Button>
          </Popconfirm>,
        ]}
        request={async (params) => getBaseProductList(params).then((res) => handleProTableRes(res))}
        rowSelection={rowSelection}
        columns={columns}
      />
      <DetailModal visible={detailModalVisible} setVisible={setDetailModalVisible} id={curId} />
      {modalVisible && (
        <AddModal
          visible={modalVisible}
          setVisible={setModalVisible}
          id={editId}
          actionRef={proActionRef}
          isAdd={isAddModal}
        />
      )}
    </Fragment>
  );
};
