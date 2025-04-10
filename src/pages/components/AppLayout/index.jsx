import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FacebookFilled
} from '@ant-design/icons';
import {  Layout,  theme } from 'antd';
import { FaFileAlt, FaPenNib, FaSearch, FaUser, FaTh, FaBell } from 'react-icons/fa';
import { FaAirbnb } from 'react-icons/fa6';
import styles from './nav.module.scss';
import { Outlet } from 'react-router-dom';

const { Header: AntHeader, Sider, Content } = Layout;

const AppLayout = ({ children,logo }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('/task');
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 导航处理函数
  const handleNavigation = (path) => {
    setActiveTab(path);
    navigate(path);
  };

  return (
    <Layout>
      {/* 顶部Header */}
      <AntHeader className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.logo}>{logo}</h1>
          <nav className={styles.mainNav}>
            <ul>
              <li 
                className={`${styles.navItem} ${activeTab === '/user' && styles.active}`} 
                onClick={() => handleNavigation('/user')}
              >
                <FaUser /> 用户中心
              </li>
              <li 
                className={`${styles.navItem} ${activeTab === '/markdown/tab' && styles.active}`} 
                onClick={() => handleNavigation('/markdown/tab')}
              >
                <FaTh /> 工作空间
              </li>
              <li 
                className={`${styles.navItem} ${activeTab === '/task/tab' && styles.active}`} 
                onClick={() => handleNavigation('/task/tab')}
              >
                <FaBell /> 任务中心
              </li>
              <li 
                className={`${styles.navItem} ${activeTab === '/language' && styles.active}`} 
                onClick={() => handleNavigation('/language')}
              >
                <FacebookFilled /> 中文
              </li>
            </ul>
          </nav>
        </div>
      </AntHeader>

      <Layout>
        {/* 侧边栏 */}
        <Sider 
          trigger={null} 
          width={collapsed ? "3vw" : "3vw"}  // 强制保持3vw宽度
          collapsedWidth="3vw"              // 折叠状态保持一致
          className={styles.sider}
        >
          <div className="demo-logo-vertical" />
           <nav className={styles.nav}>
                <ul>
                  <li className={styles.navItem}>
                    <Link to="/markdown/tab" className={styles.link}>
                      <FaAirbnb className={styles.icon} />
                    </Link>
                  </li>
                  <li className={styles.navItem}>
                    <Link to="/result/tab" className={styles.link}>
                      <FaFileAlt className={styles.icon} />
                    </Link>
                  </li>
                  <li className={styles.navItem}>
                    <Link to="/patents" className={styles.link}>
                      <FaPenNib className={styles.icon} />
                    </Link>
                  </li>
                  <li className={styles.navItem}>
                    <Link to="/search/main" className={styles.link}>
                      <FaSearch className={styles.icon} />
                    </Link>
                  </li>
                </ul>
              </nav>
          

        </Sider>

        {/* 主内容区 */}
        <Content
          className={styles.content}
        >
          <Outlet />
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;