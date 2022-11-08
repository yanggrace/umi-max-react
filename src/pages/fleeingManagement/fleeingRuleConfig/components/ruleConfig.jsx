/*
 * @Author: wangrui
 * @Date: 2022-08-22 08:53:16
 * @LastEditors: wangrui
 * @Description:窜货规则配置新增/编辑
 * @LastEditTime: 2022-08-26 14:34:38
 */
import { Modal, Button, Input, message, Select, Table } from 'antd';
import { useState, useRef, useEffect } from 'react';
import { getProvince, getCity, saveFleeingConfig, getFleeingDetail, editFleeingConfig } from '../serveice';
import { uniqueId, cloneDeep } from 'lodash';
import { handleRes } from '@/utils/index';

import RangeNum from './rangeNum';

const RuleConfig = ({ params, setEditParams }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSource, setDataSource] = useState([{ id: uniqueId() }]);
  const [provinceOption, setProvinceOption] = useState([]);
  const [cityOption, setCityOption] = useState([]);
  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedRowKeys(selectedRowKeys);
    },
    selectedRowKeys,
  };
  useEffect(() => {
    getProvinceList();
  }, []);
  useEffect(() => {
    if (!params.id) return;
    getDetails(params.id);
  }, [params.id]);
  const add_config_columns = [
    {
      title: '省',
      align: 'center',
      dataIndex: 'provinceCode',
      render: (text, record, index) => {
        return (
          <Select
            labelInValue
            options={provinceOption}
            value={
              text
                ? {
                    label: record.provinceName,
                    value: record.provinceCode,
                    key: record.provinceCode,
                  }
                : undefined
            }
            fieldNames={{ label: 'name', value: 'code' }}
            onChange={(v) => {
              selectChange(v, index, 'province', { cityCode: undefined });
              getNextOption(v, setCityOption, cityOption, index);
            }}
            allowClear
            style={{ width: 150 }}
            placeholder='请选择'
          ></Select>
        );
      },
    },
    {
      title: '市',
      align: 'center',
      dataIndex: 'cityCode',
      render: (text, record, index) => {
        return (
          <Select
            labelInValue
            options={cityOption[index]}
            value={
              text
                ? {
                    label: record.cityName,
                    value: record.cityCode,
                    key: record.cityCode,
                  }
                : undefined
            }
            fieldNames={{ label: 'name', value: 'code' }}
            onChange={(v) => {
              selectChange(v, index, 'city');
            }}
            allowClear
            style={{ width: 150 }}
            placeholder='请选择'
          ></Select>
        );
      },
    },
    {
      title: '取证数量',
      align: 'center',
      dataIndex: 'num',
      render: (text, record, index) => {
        return (
          <RangeNum
            value={text}
            onChange={(v) => {
              setNum(v, index);
            }}
          />
        );
      },
    },
  ];

  return (
    <Modal
      title={params.type == 1 ? '新增' : '编辑'}
      visible={params.visible}
      onCancel={() => {
        setDataSource([{ id: uniqueId() }]);
        setEditParams.bind(this, {
          id: '',
          visible: false,
        })();
      }}
      width='60vw'
      onOk={() => {
        submit();
      }}
    >
      <div style={{ margin: '20px 0 10px' }}>
        {params.type === 1 ? (
          <>
            <Button style={{ margin: '0 20px 0' }} onClick={() => addLine()} type='primary'>
              添加行
            </Button>
            <Button type='primary' onClick={() => deleteLine()}>
              删除行
            </Button>
          </>
        ) : (
          ''
        )}
      </div>
      <Table
        columns={add_config_columns}
        rowSelection={{
          ...rowSelection,
        }}
        dataSource={dataSource}
        pagination={false}
        rowKey={(record) => record.id}
        scroll={{ x: 'max-content' }}
        bodyStyle={{
          padding: 0,
          background: '#f0f2f5',
        }}
      />
    </Modal>
  );
  // 新增行
  function addLine() {
    let newData = cloneDeep(dataSource);
    newData.push({ id: uniqueId() });
    setDataSource(newData);
  }
  function deleteLine(index) {
    if (!selectedRowKeys.length) return;
    let newData = dataSource.filter((v) => !selectedRowKeys.some((m) => m === v.id));
    setSelectedRowKeys([]);
    setDataSource(newData);
  }
  // select修改
  async function selectChange(v, index, filed, params) {
    const { label, value } = v || {};
    let newData = cloneDeep(dataSource);
    newData[index] = {
      ...newData[index],
      [`${filed}Name`]: label,
      [`${filed}Code`]: value,
      ...params,
    };
    setDataSource(newData);
  }
  // 获取省
  async function getProvinceList() {
    const { data } = await getProvince();
    setProvinceOption(data);
  }
  // 获取下一级的下拉框
  async function getNextOption(v, setFun, fnData, index) {
    const { value } = v || {};
    if (!value) return;
    let { data } = await getCity({ provinceCode: value });
    let newData = cloneDeep(fnData);

    newData[index] = data;
    setFun(newData);
  }
  function setNum(v, index) {
    let newData = cloneDeep(dataSource);
    newData[index] = {
      ...newData[index],
      ...v,
    };
    setDataSource(newData);
  }
  async function submit() {
    if (!checkParams(dataSource)) return;
    // 新增
    let res;
    if (params.type == 1) {
      const data = dataSource.map((item) => {
        delete item.id;
        return item;
      });
      res = await saveFleeingConfig(data);
    } else {
      res = await editFleeingConfig(dataSource[0]);
    }
    if (!handleRes(res, params.tableRef)) return;
    setDataSource([{ id: uniqueId() }]);
    setEditParams.bind(this, {
      id: '',
      visible: false,
    })();
  }
  async function getDetails(id) {
    const { data } = await getFleeingDetail(id);
    data.provinceCode && getNextOption({ value: data.provinceCode }, setCityOption, cityOption, 0);
    const { boxMin, boxMax } = data || {};
    setDataSource([{ ...data, num: { boxMin, boxMax } }]);
  }
  function checkParams(paramsData = []) {
    for (let i = 0; i < paramsData.length; i++) {
      if (!paramsData[i].provinceCode) {
        message.warn(`请选择第${i + 1}行省`);
        return false;
      }
      if (!paramsData[i].boxMin && !paramsData[i].boxMax) {
        message.warn(`请配置第${i + 1}行取证数量`);
        return false;
      }
    }
    return true;
  }
};
export default RuleConfig;
