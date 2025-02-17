import React, { useState } from 'react';
import headstyles from './index.module.scss';
import { FaUser, FaTh, FaBell } from 'react-icons/fa';
import { FacebookFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router';

function Header2(props) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('/task'); // 默认选中任务中心

  const toUser = () => {
    setActiveTab('/user'); // 更新选中状态
    navigate('/user');
  };

  const toWork = () => {
    setActiveTab('/task'); // 更新选中状态
    navigate('/task');
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
    <header className={headstyles.taskheader}>
      <h1 className={headstyles.logo}>数据文献提取结果</h1>
      <nav>
        <ul>
          <li className={`${headstyles.navItem} ${activeTab === '/user' && headstyles.active}`} onClick={toUser}>
            <FaUser /> 用户中心
          </li>
          <li className={`${headstyles.navItem} ${activeTab === '/markdown' && headstyles.active}`} onClick={toWork}>
            <FaTh /> 工作空间
          </li>
          <li className={`${headstyles.navItem} ${activeTab === '/task' && headstyles.active}`} onClick={toTask}>
            <FaBell /> 任务中心
          </li>
          <li className={`${headstyles.navItem} ${activeTab === '/language' && headstyles.active}`} onClick={toLanguage}>
            <FacebookFilled /> 中文
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header2;