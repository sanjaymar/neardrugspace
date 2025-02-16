import React from 'react';
import { CommentOutlined, HomeFilled, MacCommandOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons'; // 导入返回图标
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import styles from './index.module.scss';

function MyHeader(props) {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  const toContact = () => {
    navigate('/contact');
  };
  const toLanguage = () => {
    navigate('/language');
  };
  const toMain = () => {
    navigate('/main');
  };
  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <span>PatMDAP</span>
      </div>
      <div className={styles.navItems}>
      <li className={styles.navigationItem} onClick={toMain}>
          <ArrowLeftOutlined />
          <span className={styles.navText}>返回主页</span>
        </li>
      <li className={styles.navigationItem} onClick={toContact}>
          <CommentOutlined />
          <span className={styles.navText}>联系我们</span>
        </li>
        <li className={styles.navigationItem} onClick={toLanguage}>
          <MacCommandOutlined />
          <span className={styles.navText}>中文</span>
        </li>

      </div>
    </nav>
  );
}

export default MyHeader;