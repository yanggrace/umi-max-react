import {defineConfig} from '@umijs/max';
import routes from './routes';
export default defineConfig({
  base: '/',
  publicPath: '/oims-web/',
  history: {type: 'hash'},
  // layout: {
  //   title: '系统名称',
  //   locale: false,
  //   layout: 'side',
  //   contentWidth: 'Fluid',
  // },
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {
    dataField: 'data',
  },
  define: {
    UMI_ENV: process.env.UMI_ENV || '',
  },
  devtool: 'source-map',
  mfsu: {esbuild: true},
  clientLoader: {},
  routes,
  npmClient: 'yarn',
});
