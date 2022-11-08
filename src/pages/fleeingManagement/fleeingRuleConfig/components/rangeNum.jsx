/*
 * @Author: wangrui
 * @Date: 2022-08-22 16:49:58
 * @LastEditors: wangrui
 * @Description:
 * @LastEditTime: 2022-08-25 11:23:35
 */
import { InputNumber } from 'antd';
import { useState, useEffect } from 'react';
function RangeNum({ value, onChange }) {
  const [boxMax, setMaxNum] = useState(value?.boxMax || '');
  const [boxMin, setMinNum] = useState(value?.boxMin || '');
  useEffect(() => {
    onChange({
      boxMax,
      boxMin,
    });
  }, [boxMin, boxMax]);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #d9d9d9', color: '#d9d9d9' }}>
      <InputNumber bordered={false} style={{ width: '100%' }} min={0} max={boxMax} onChange={setMinNum} defaultValue={boxMin} placeholder='最小值'></InputNumber>
      <span>至</span>
      <InputNumber bordered={false} style={{ width: '100%' }} min={boxMin} onChange={setMaxNum} defaultValue={boxMax} placeholder='最大值'></InputNumber>
    </div>
  );
}
export default RangeNum;
