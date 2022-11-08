export const DEFAULT_NAME = 'Umi Max';

export const SUCCESS_CODE = '00000';

// 处理移交数据，类型对应的值
export const HANDLE_TYPE = {
  priceSearch: 1, // 价格异常
  smuggling: 2, // 窜货
  counterfeit: 3, // 假冒
};

// 表格配置
export const TABLE_CONFIG = {
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
