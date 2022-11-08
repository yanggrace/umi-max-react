import Guide from '@/components/Guide';
import {trim} from '@/utils/format';
import {PageContainer} from '@ant-design/pro-components';
import {useModel} from '@umijs/max';
import DetailModal from './components/detailModal';
import styles from './index.less';
import {useState} from 'react';

const HomePage = () => {
  const {name} = useModel('global');
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  return (
    <PageContainer ghost>
      <div className={styles.container}>
        <Guide name={trim(name)} />
        <button onClick={() => setDetailModalVisible(true)}>点击</button>
        <DetailModal visible={detailModalVisible} setVisible={setDetailModalVisible} id={1} />
      </div>
    </PageContainer>
  );
};

export default HomePage;
