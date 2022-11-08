const menuRoute =
  process.env.NODE_ENV !== 'development'
    ? {
      menuRender: false,
      hideInMenu: true,
    }
    : {};
const mrChenRouter = [
  {
    name: '提报中心',
    path: '/reportsCenter',
    routes: [
      {
        path: '/reportsCenter',
        redirect: '/reportsCenter/dealer',
      },
      {
        name: '经销商提报',
        path: '/reportsCenter/dealer',
        component: './reportsCenter/dealer',
        ...menuRoute,
      },
      {
        name: '产品维护',
        path: '/reportsCenter/productMaintain',
        component: './reportsCenter/productMaintain',
        ...menuRoute,
      },
      {
        name: '经销商提报管理中心',
        path: '/reportsCenter/dealerCenter',
        component: './reportsCenter/dealerCenter',
        ...menuRoute,
      },
      {
        name: '业务员提报管理中心',
        path: '/reportsCenter/salesmanOne',
        component: './reportsCenter/salesmanOne',
        ...menuRoute,
      },
      {
        name: '窜货核查列表',
        path: '/reportsCenter/checkList',
        component: './reportsCenter/checkList',
        ...menuRoute,
      },
      {
        name: '收货通知单列表',
        path: '/reportsCenter/noticeBillList',
        component: './reportsCenter/noticeBillList',
        ...menuRoute,
      },
    ],
  },
  {
    name: '流程表单',
    path: '/processForm',
    routes: [
      {
        path: '/processForm',
        redirect: '/processForm/feelForm',
      },
      {
        name: '核查报告',
        path: '/processForm/feelForm/:id',
        component: './processForm/feelForm',
        ...menuRoute,
      },
      {
        name: '收货通知单',
        path: '/processForm/noticeBill/:id',
        component: './processForm/noticeBill',
        ...menuRoute,
      },
    ],
  },
];
export default mrChenRouter;
