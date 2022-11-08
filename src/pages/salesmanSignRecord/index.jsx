import React, {useRef, Fragment, useState} from 'react';
import {ProTable} from '@ant-design/pro-components';
import {handleProTableRes, Container, downLoadFile} from '@/utils/index';
import {Button, Modal, Row, Col, Select, message} from 'antd';
import {reportPage, getAllArea, getCompanyByArea, detailPage, attendanceStatistics, exportExcels} from './service';
import styles from './config';
import {Access, useAccess} from '@umijs/max';
const {Option} = Select;
const statusEnum = [
  {label: '缺勤', value: 0},
  {label: '正常', value: 1},
  {label: '异地', value: 2},
  {label: '补录', value: 3},
];

const tabeConfig = {
  rowKey: 'id',
  labelWidth: 'auto',
  pagination: {
    showSizeChanger: true,
    defaultPageSize: 10,
    hideOnSinglePage: false,
    pageSizeOptions: [5, 10, 20, 50, 100],
  },
  options: {
    reload: false,
    density: true,
    fullScreen: true,
  },
  tableAlertRender: false,
  tableAlertOptionRender: false,
  revalidateOnFocus: false,
};

const dateTimeStr = (str) => {
  var date = new Date(),
    year = date.getFullYear(), //年
    month = date.getMonth() + 1, //月
    day = date.getDate(), //日
    hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(), //时
    minute = date.getMinutes() < 10 ? date.getMinutes() : date.getMinutes(), //分
    second = date.getSeconds() < 10 ? date.getSeconds() : date.getSeconds(); //秒
  month >= 1 && month <= 9 ? (month = '0' + month) : '';
  day >= 0 && day <= 9 ? (day = '0' + day) : '';
  hour >= 0 && hour <= 9 ? hour : '';
  minute >= 0 && minute <= 9 ? (minute = '0' + minute) : '';
  second >= 0 && second <= 9 ? (second = '0' + second) : '';
  if (str.indexOf('y') != -1) {
    str = str.replace('y', year);
  }
  if (str.indexOf('m') != -1) {
    str = str.replace('m', month);
  }
  if (str.indexOf('d') != -1) {
    str = str.replace('d', day);
  }
  if (str.indexOf('h') != -1) {
    str = str.replace('h', hour);
  }
  if (str.indexOf('i') != -1) {
    str = str.replace('i', minute);
  }
  if (str.indexOf('s') != -1) {
    str = str.replace('s', second);
  }
  return str;
};

function salesmanSignRecord() {
  const btnCodes = useAccess().route_btn_codes();
  const [accessBtnCode,setAccessBtnCode] = useState(btnCodes);
  const proTableRef = useRef();
  const tableFormRef = useRef();
  const [branchArr, setBranchArr] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [visible, setVisible] = useState(false);
  const [statistics, setStatistics] = useState({});
  const [exportLoading, setExportLoading] = useState(false);

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
      fixed: 'left',
    },
    {
      title: '事业部人员编码',
      dataIndex: 'personnelCode',
      search: false,
      width: 150,
      fixed: 'left',
    },
    {
      title: '事业部人员名称',
      dataIndex: 'personnelName',
      width: 150,
      fixed: 'left',
    },
    {
      title: '岗位名称',
      dataIndex: 'positionName',
      search: false,
      width: 150,
    },
    {
      title: '事业部人员电话',
      dataIndex: 'mobile',
      width: 150,
    },
    {
      title: '所属大区',
      dataIndex: 'regionCode',
      valueType: 'select',
      width: 150,
      request: async () => getAllArea().then((res) => res.data),
      fieldProps: {
        onChange: getAllCompany,
        fieldNames: {label: 'areaName', value: 'areaId'},
        showSearch: true,
        filterOption: (inputValue, option) => option.areaName.includes(inputValue),
      },
    },
    {
      title: '所属分办',
      width: 150,
      dataIndex: 'branchCode',
      valueType: 'select',
      fieldProps: {
        options: branchArr,
        showSearch: true,
        filterOption: (inputValue, option) => option.companyName.includes(inputValue),
        fieldNames: {label: 'companyName', value: 'companyId'},
      },
    },
    {
      title: '本月打卡天数',
      dataIndex: 'makeupDay',
      search: false,
      width: 150,
    },
    {
      title: '本月对应区域打卡天数',
      dataIndex: 'attendanceNormalDay',
      search: false,
      width: 150,
    },
    {
      title: '本月非对应区域打卡天数',
      dataIndex: 'attendanceAbnormalDay',
      search: false,
      width: 150,
    },
    {
      title: '本月补卡天数',
      dataIndex: 'makeupDay',
      search: false,
      width: 150,
    },
    {
      title: '缺勤天数',
      dataIndex: 'absentDay',
      search: false,
      width: 150,
    },
  ];
  const columns2 = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 48,
      fixed: 'left',
    },
    {
      title: '打卡日期',
      dataIndex: 'attendanceTime',
      search: false,
    },
    {
      title: '打卡月份',
      valueType: 'dateMonth',
      dataIndex: 'yearMonth',
      hideInTable: true,
    },
    {
      title: '大区名称',
      dataIndex: 'regionName',
      search: false,
    },
    {
      title: '分公司名称',
      search: false,
      dataIndex: 'branchName',
    },
    {
      title: '打卡地址',
      search: false,
      dataIndex: 'address',
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      request: () => statusEnum,
      fieldProps: {
        getPopupContainer: (triggerNode) => {
          return triggerNode.parentNode || document.body;
        },
      },
    },
  ];
  const rowSelection = {
    type: 'radio',
    selectedRowKeys: selectedRow.map((v) => v.personnelCode),
    onChange: (keys, rows) => {
      setSelectedRow(rows);
    },
  };

  return (
    <Fragment>
      <ProTable
        headerTitle="事业部人员打卡记录"
        search={{labelWidth: 'auto'}}
        columns={columns}
        formRef={tableFormRef}
        actionRef={proTableRef}
        rowSelection={rowSelection}
        {...tabeConfig}
        rowKey="personnelCode"
        scroll={{x: columns.reduce((v, m) => v + m.width, 0)}}
        request={async (params) => reportPage(params).then((res) => handleProTableRes(res))}
        toolBarRender={() => [
          <Button onClick={getDetails} type="primary">
            查看
          </Button>,
          <Access accessible={accessBtnCode['expoerPdf'] || false}>
            <Button loading={exportLoading} onClick={exportFile.bind(this, 'pdf')} type="primary">
              导出pdf
            </Button>
          </Access>,
          <Access accessible={accessBtnCode['exportExcel'] || false}>
            <Button loading={exportLoading} onClick={exportFile.bind(this, 'excel')} type="primary">
              导出excel
            </Button>
          </Access>,
        ]}
      />
      <Modal
        destroyOnClose
        visible={visible}
        title="事业部人员考勤详情"
        footer={false}
        width={1200}
        onCancel={setVisible.bind(this, false)}
        getContainer={Container}
      >
        <Row gutter={40}>
          <Col span={6}>
            <Select
              getPopupContainer={(triggerNode) => {
                return triggerNode.parentNode || document.body;
              }}
              style={styles.titleBox}
              defaultValue="yearMonth"
              onChange={changeYearOrMonth}
              bordered={false}
            >
              <Option value="year">当年数据</Option>
              <Option value="yearMonth"> 当月数据</Option>
            </Select>
          </Col>
          <Col span={6}>
            <div style={styles.card}>
              <div style={styles.cardName}>总打卡天数</div>
              <div style={styles.cardNum}>{statistics?.attendanceAllDay}</div>
            </div>
          </Col>
          <Col span={6}>
            <div style={styles.card}>
              <div style={styles.cardName}>异地打卡天数</div>
              <div style={styles.cardNum}>{statistics?.attendanceAbnormalDay}</div>
            </div>
          </Col>
          <Col span={6}>
            <div style={styles.card}>
              <div style={styles.cardName}>缺勤天数</div>
              <div style={styles.cardNum}>{statistics?.absentDay}</div>
            </div>
          </Col>
        </Row>
        <ProTable
          headerTitle="事业部人员人脸信息"
          search={{labelWidth: 'auto'}}
          columns={columns2}
          {...tabeConfig}
          request={async (params) =>
            detailPage({...params, ...selectedRow[0]}).then((res) => {
              const data = {
                success: res.code === '00000',
                total: res?.data.length,
                data: res?.data,
              };
              return data;
            })
          }
          rowKey="attendanceTime"
        />
      </Modal>
    </Fragment>
  );
  // 请求分公司
  async function getAllCompany(areaId) {
    try {
      tableFormRef.current.setFieldsValue({branchCode: undefined});
      let res = await getCompanyByArea(areaId);
      setBranchArr(res.data);
    } catch (err) {}
  }
  // 查看详情
  async function getDetails() {
    if (!selectedRow.length) {
      return message.warning('请选择行数据');
    }
    await changeYearOrMonth('yearMonth');
    setVisible(true);
  }
  async function changeYearOrMonth(value) {
    let params;
    if (value === 'year') {
      params = {
        year: dateTimeStr('y'),
      };
    }
    if (value === 'yearMonth') {
      params = {
        yearMonth: dateTimeStr('y-m'),
      };
    }
    const {data} = await attendanceStatistics(params);
    setStatistics(data);
  }
  // 导出
  async function exportFile() {
    setExportLoading(true);
    let res = await exportExcels({});
    downLoadFile(res, '事业部人员打卡记录', 'pdf');
    setExportLoading(false);
  }
}

export default salesmanSignRecord;
