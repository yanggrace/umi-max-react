/*
 * @Author: wangrui
 * @Date: 2022-09-06 10:53:29
 * @LastEditors: wangrui
 * @Description:
 * @LastEditTime: 2022-09-06 10:58:56
 */
import { SearchOutlined } from '@ant-design/icons';
import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { Table, Row, Col, InputNumber, Button, Input } from 'antd';
import ProcessLog from './../../components/processLog';

import styles from './../index.less';

function ExamineForm({ initialData, disabled }, ref) {
  const [processLog, setProcessLog] = useState({ id: 1, visible: false });

  const formRef = useRef();
  useImperativeHandle(ref, () => ({
    formRef,
  }));
  return (
    <>
      <Row className={styles.rowStyle}>
        <Col span={12} className={styles.colStyle}>
          审核状态
        </Col>
        <Col span={12} className={styles.colStyle}>
          <Button type='primary'>确认提交</Button>
        </Col>
      </Row>
      <Row className={styles.rowStyle}>
        <Col span={12} className={styles.colStyle}>
          审核意见
        </Col>
        <Col span={12} className={styles.colStyle}>
          <Input placeholder='请输入审核意见' />
        </Col>
      </Row>
      <Row className={styles.rowStyle}>
        <Col span={12} className={styles.colStyle}>
          审核流程图
        </Col>
        <Col span={12} className={styles.colStyle}>
          <Button icon={<SearchOutlined />} onClick={() => setProcessLog({ ...processLog, visible: true })}>
            查看流程日志
          </Button>
        </Col>
      </Row>
      <ProcessLog params={processLog} setParams={setProcessLog} />
    </>
  );
}
export default forwardRef(ExamineForm);
