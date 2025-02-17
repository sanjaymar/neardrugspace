import React from 'react';
import { Link } from 'react-router-dom'; // 引入 Link 组件
import styles from "./index.module.scss";

const FeatureCard = ({ title, listItems, imageSrc, to }) => { // 添加 to 属性
  return (
    <section className={styles.card}>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.cardcontent}>
        <div className={styles.left}>
          <ul className={styles.list}>
            {listItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          {/* 使用 Link 组件替换 button */}
          <Link to={to} className={styles.button}>去使用</Link>
        </div>
        <div className={styles.right}>
          <img src={imageSrc} alt={title} /> {/* 添加 alt 属性 */}
        </div>
      </div>
    </section>
  );
};

export default FeatureCard;