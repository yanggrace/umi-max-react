import { Outlet } from 'umi'
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';


export default () => {
    return <div>
        <ConfigProvider locale={zh_CN}>
            <Outlet />
        </ConfigProvider>
    </div>;
}