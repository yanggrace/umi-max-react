# README

`@umijs/max` 模板项目，更多功能参考 [Umi Max 简介](https://next.umijs.org/zh-CN/docs/max/introduce)

# portal 页面配置 eg: home 为本项目路由

https://peixun.chinayanghe.com/oims-web/#/home

# 表格公共配置

可以从 constants/index.js 中引入 TABLE_CONFIG ,如果不满足页面要求，可以自己写属性覆盖：

<code>
<ProTable 
  {...TABLE_CONFIG}
>
</ProTable>
</code>

# antd 版本 不要升级

弹窗在 portal-web 最外层，升级后，会导致样式错乱，select 等组件无法渲染的问题
