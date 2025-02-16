import React from 'react';
import { CommentOutlined, HomeFilled, MacCommandOutlined,LoginOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import styles from './index.module.scss';

function WelcomeHeader(props) {
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

  const toLogin = () => {
    navigate('/login');
  };
  const toContact = () => {
    navigate('/contact');
  };
  const toLanguage = () => {
    navigate('/language');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <span>PatMDAP</span>
      </div>
      <div className={styles.navItems}>
         <li className={styles.navigationItem}>
          <Button
            type="dashed"
            className={styles.experienceButton}
            onClick={toLogin}
          >
            立即体验
          </Button>
        </li>
        <li className={styles.navigationItem} onClick={toContact}>
          <CommentOutlined />
          <span className={styles.navText}>联系我们</span>
        </li>
        <li className={styles.navigationItem} onClick={toLanguage}>
          <MacCommandOutlined />
          <span className={styles.navText}>中文</span>
        </li>
        <li className={styles.navigationItem} onClick={toLogin}>
          <LoginOutlined  />
          <span className={styles.navText}>登录</span>
        </li>

      </div>
    </nav>
  );
}

export default WelcomeHeader;