/*
 * @Author: wangrui
 * @Date: 2022-08-24 10:46:40
 * @LastEditors: wangrui
 * @Description: 流程日志
 * @LastEditTime: 2022-08-24 11:06:12
 */
import { Drawer } from 'antd';
import styles from './index.less';
function ProcessLog({ params, setParams }) {
  return (
    <Drawer placement='right' title='流程日志' size='large' onClose={() => setParams({ ...params, visible: false })} visible={params.visible}>
      <div className={styles.process}>
        <div>
          <div className={styles.title}>2022-07-14</div>
        </div>
        {[1, 2, 3].map((item) => (
          <div className={styles.processItem} key={item}>
            <div className={styles.processItemDate}>18:36</div>
            <div className={styles.processItemHeader}>
              <div>操作人员： xxxx</div>
              <div>2022.07.18 18:00</div>
            </div>
            <div className={styles.processContent}>
              <div className={styles.processContentItem}>
                <div>
                  处理岗位 <span className={styles.c}>xxx</span>
                </div>
                <div>
                  处理人员 <span className={styles.c}>xxx</span>
                </div>
                <div>
                  操作动作 <span className={styles.c}>xxx</span>
                </div>
              </div>
              <div>
                <div>
                  审核意见：<span className={styles.c}>xxxx</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Drawer>
  );
}
export default ProcessLog;
