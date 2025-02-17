import React, { useState } from 'react';
import  styles from './index.module.scss';
import { FaUser, FaTh, FaBell } from 'react-icons/fa';
import { FacebookFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router';

function Header2(props) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('/work'); // 默认选中工作空间

  const toUser = () => {
    setActiveTab('/user'); // 更新选中状态
    navigate('/user');
  };

  const toWork = () => {
    setActiveTab('/work'); // 更新选中状态
    navigate('/work');
  };

  const toTask = () => {
    setActiveTab('/main'); // 更新选中状态
    navigate('/main');
  };

  const toLanguage = () => {
    setActiveTab('/language'); // 更新选中状态
    navigate('/language');
  };

  return (
    <header className={ styles.header}>
      <h1 className={ styles.logo}>PDF转MarkDown</h1>
      <nav>
        <ul>
          <li className={`${ styles.navItem} ${activeTab === '/user' &&  styles.active}`} onClick={toUser}>
            <FaUser /> 用户中心
          </li>
          <li className={`${ styles.navItem} ${activeTab === '/work' &&  styles.active}`} onClick={toWork}>
            <FaTh /> 工作空间
          </li>
          <li className={`${ styles.navItem} ${activeTab === '/main' &&  styles.active}`} onClick={toTask}>
            <FaBell /> 任务中心
          </li>
          <li className={`${ styles.navItem} ${activeTab === '/language' &&  styles.active}`} onClick={toLanguage}>
            <FacebookFilled /> 中文
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header2;