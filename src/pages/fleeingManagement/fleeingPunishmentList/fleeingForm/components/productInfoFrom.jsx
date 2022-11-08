/*
 * @Author: wangrui
 * @Date: 2022-09-06 10:01:23
 * @LastEditors: wangrui
 * @Description: 产品信息
 * @LastEditTime: 2022-09-08 11:09:47
 */
import { useState, forwardRef, useRef, useImperativeHandle, useEffect } from 'react';
import { EditableProTable } from '@ant-design/pro-components';
import { product_column } from './../config';
import { Table } from 'antd';
const { Summary } = Table;
function ProductInfoForm({ initialData = [], disabled }, ref) {
  const [editableKeys, serEditableKeys] = useState();
  const [productDataList, setProductDataList] = useState([{ name: 1, age: 2, id: 3 }]);
  const formRef = useRef();
  useEffect(() => {
    if (initialData) {
      setProductDataList(initialData);
      // serEditableKeys(initialData.map((item) => item.id));
    }
  }, [initialData]);
  useImperativeHandle(ref, () => ({
    formRef,
    productDataList,
  }));
  return (
    <>
      <EditableProTable
        rowKey='id'
        editable={{
          editableKeys: editableKeys,
          onValuesChange: (record, recordList) => {
            setProductDataList(recordList);
          },
        }}
        formRef={formRef}
        scroll={{ x: 2600 }}
        columns={product_column}
        recordCreatorProps={false}
        value={productDataList}
        summary={() => {
          return (
            <Summary>
              <Summary.Row>
                <Summary.Cell align='center' index={0}>
                  总计：
                </Summary.Cell>
                <Summary.Cell align='center' index={1}>
                  {calculateSummary(productDataList, 'totalReward')}
                </Summary.Cell>
                <Summary.Cell align='center' index={2}></Summary.Cell>
                <Summary.Cell align='center' index={3}>
                  {calculateSummary(productDataList, 'cancelBonus')}
                </Summary.Cell>
                <Summary.Cell align='center' index={4}>
                  {calculateSummary(productDataList, 'securityDeposit')}
                </Summary.Cell>
                <Summary.Cell align='center' index={5}></Summary.Cell>
                <Summary.Cell align='center' index={6}>
                  {calculateSummary(productDataList, 'deductSales')}
                </Summary.Cell>
                <Summary.Cell align='center' index={7}></Summary.Cell>
                <Summary.Cell align='center' index={8}></Summary.Cell>
                <Summary.Cell align='center' index={9}>
                  {calculateSummary(productDataList, 'quantity')}
                </Summary.Cell>
                <Summary.Cell align='center' index={10}></Summary.Cell>
                <Summary.Cell align='center' index={11}></Summary.Cell>
                <Summary.Cell align='center' index={12}>
                  {calculateSummary(productDataList, 'quantityBox')}
                </Summary.Cell>
              </Summary.Row>
            </Summary>
          );
        }}
      ></EditableProTable>
    </>
  );
  // 计算总和
  function calculateSummary(list = [], name) {
    return list.reduce((pre, cur) => pre + cur[name], 0);
  }
}

export default forwardRef(ProductInfoForm);
