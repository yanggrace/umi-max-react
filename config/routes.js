const menuRoute =
  process.env.NODE_ENV !== 'development'
    ? {
        menuRender: false,
        hideInMenu: true,
      }
    : {};
import mrChenRouter from './mrChenRouter';

export default routes = [
  {
    name: '登录',
    path: '/user/login',
    component: './user/Login',
    ...menuRoute,
  },
  {
    path: '/',
    component: '@/layouts/index',
    flatMenu: 'true',
    routes: [
      {
        path: '/',
        redirect: '/home',
      },
      {
        name: '首页',
        path: '/home',
        component: './Home',
        ...menuRoute,
      },
      {
        name: '事业部人员打卡报表记录',
        path: '/salesmanSignRecord',
        component: './salesmanSignRecord',
        ...menuRoute,
      },
      {
        name: '权限演示',
        path: '/access',
        component: './Access',
        ...menuRoute,
      },
      {
        name: '产品基准价格维护',
        path: '/baseProduct',
        component: './BaseProduct',
        ...menuRoute,
      },
      {
        name: '秩序专员人员配置',
        path: '/OrderDirector',
        component: './OrderDirector',
        ...menuRoute,
      },
      {
        name: '监管中心人员配置',
        path: '/ChargeCenter',
        component: './ChargeCenter',
        ...menuRoute,
      },
      {
        name: '计划制定记录',
        path: '/PlanDraft',
        component: './PlanDraft',
        ...menuRoute,
      },
      {
        name: '常规检查记录',
        path: '/ConventionCheck',
        component: './ConventionCheck',
        ...menuRoute,
      },
      {
        name: '窜货线索',
        path: '/smugglingClue',
        component: './SmugglingClue',
        ...menuRoute,
      },
      {
        name: '查看窜货线索',
        path: '/smugglingClue/detailPage/:id',
        component: './SmugglingClue/components/detailPage',
        ...menuRoute,
      },
      {
        name: '价格异常',
        path: '/priceResearch',
        component: './PriceResearch',
        ...menuRoute,
      },
      {
        name: '查看价格异常',
        path: '/priceResearch/detailPage/:id',
        component: './PriceResearch/components/detailPage',
        ...menuRoute,
      },
      {
        name: '假冒侵权',
        path: '/counterfeit',
        component: './Counterfeit',
        ...menuRoute,
      },
      {
        name: '查看假冒侵权',
        path: '/counterfeit/detailPage/:id',
        component: './Counterfeit/components/detailPage',
        ...menuRoute,
      },
      {
        name: '窜货收获通知单',
        path: '/harvestNotice',
        component: './HarvestNotice',
        ...menuRoute,
      },
      {
        name: '假冒侵权报表',
        path: '/counterfeitingReport',
        routes: [
          {
            path: '/counterfeitingReport',
            redirect: '/counterfeitingReport/reportlist',
          },
          {
            name: '假冒侵权侵权登记列表',
            path: '/counterfeitingReport/reportlist',
            component: './counterfeitingReport/reportlist',
            ...menuRoute,
          },
          {
            name: '案件登记单',
            path: '/counterfeitingReport/reportForm/:id',
            component: './counterfeitingReport/reportForm',
            ...menuRoute,
          },
        ],
      },
      {
        name: '窜货表单',
        path: '/fleeingForm',
        routes: [
          {
            title: '整改验收单',
            path: '/fleeingForm/rectificationForm/:id',
            component: './fleeingForm/rectificationForm',
            ...menuRoute,
          },
          {
            name: '整改验收单列表',
            path: '/fleeingForm/rectificationFormList',
            component: './fleeingForm/rectificationFormList',
            ...menuRoute,
          },
        ],
      },
      {
        name: '窜货管理',
        path: '/fleeingManagement',
        routes: [
          {
            path: '/fleeingManagement',
            redirect: '/fleeingManagement/specialProductConfig',
          },
          {
            name: '特殊产品配置',
            path: '/fleeingManagement/specialProductConfig',
            component: './fleeingManagement/specialProductConfig',
            ...menuRoute,
          },
          {
            name: '窜货规则配置',
            path: '/fleeingManagement/fleeingRuleConfig',
            component: './fleeingManagement/fleeingRuleConfig',
            ...menuRoute,
          },
          {
            name: '窜货处罚管理列表',
            path: '/fleeingManagement/fleeingPunishmentList',
            component: './fleeingManagement/fleeingPunishmentList',
            ...menuRoute,
          },
          {
            name: '窜货表单',
            path: '/fleeingManagement/fleeingPunishmentList/fleeingForm',
            component: './fleeingManagement/fleeingPunishmentList/fleeingForm',
            ...menuRoute,
          },
        ],
      },
      ...mrChenRouter,
    ],
  },
];
