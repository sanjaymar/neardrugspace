import React, { useState } from 'react';
import header3styles from './index.module.scss';
import { FaUser, FaTh, FaBell } from 'react-icons/fa';
import { FacebookFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router';

function Header(props) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('/main'); // 默认选中工作空间

  const toUser = () => {
    setActiveTab('/user'); // 更新选中状态
    navigate('/user');
  };

  const toWork = () => {
    setActiveTab('/main'); // 更新选中状态
    navigate('/main');
  };

  const toTask = () => {
    setActiveTab('/task'); // 更新选中状态
    navigate('/task');
  };

  const toLanguage = () => {
    setActiveTab('/language'); // 更新选中状态
    navigate('/language');
  };

  return (
    <header className={header3styles.header}>
      <h1 className={header3styles.logo}>近药空间数据检索</h1>
      <nav>
        <ul>
          <li className={`${header3styles.navItem} ${activeTab === '/user' && header3styles.active}`} onClick={toUser}>
            <FaUser /> 用户中心
          </li>
          <li className={`${header3styles.navItem} ${activeTab === '/main' && header3styles.active}`} onClick={toWork}>
            <FaTh /> 工作空间
          </li>
          <li className={`${header3styles.navItem} ${activeTab === '/task' && header3styles.active}`} onClick={toTask}>
            <FaBell /> 任务中心
          </li>
          <li className={`${header3styles.navItem} ${activeTab === '/language' && header3styles.active}`} onClick={toLanguage}>
            <FacebookFilled /> 中文
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;