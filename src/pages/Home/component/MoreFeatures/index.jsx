import styles from "./index.module.scss";

const MoreFeatures = ({ className }) => {
  return (
    <div className={`${styles.moreFeatures} ${className}`}>
      <div className={styles.iconWrapper}>
        <div className={styles.cloverWindmill}>
          <div className={styles.leaf1}></div>
          <div className={styles.leaf2}></div>
          <div className={styles.leaf3}></div>
          <div className={styles.leaf4}></div>
        </div>
      </div>
      <p>更多功能将陆续发布，敬请期待。。。</p>··
    </div>
  );
};

export default MoreFeatures;