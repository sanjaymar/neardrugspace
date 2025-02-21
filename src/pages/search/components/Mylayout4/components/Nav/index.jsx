import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import nav3styles from './index.module.scss';
import { FaFileAlt, FaPenNib, FaSearch } from 'react-icons/fa';
import { FaAirbnb } from 'react-icons/fa6';

function Nav(props) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // 定义一个状态来跟踪鼠标是否悬浮在菜单项上
  const [hoveredItem, setHoveredItem] = useState(null);

  return (
    <nav className={`${nav3styles.nav} ${isCollapsed ? nav3styles.collapsed : ''}`}>
      <ul>
        <li
          onMouseEnter={() => isCollapsed && setHoveredItem('PDF2Markdown')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <Link to="/markdown" className={nav3styles.link}>
            <FaAirbnb/>
            {isCollapsed && hoveredItem === 'PDF2Markdown' ? <span>PDF2Markdown</span> : null}
          </Link>
        </li>
        <li
          onMouseEnter={() => isCollapsed && setHoveredItem('dataExtraction')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <Link to="/main" className={nav3styles.link}>
            <FaFileAlt />
            {isCollapsed && hoveredItem === 'dataExtraction' ? <span>结构化专利数据</span> : null}
          </Link>
        </li>
        <li
          onMouseEnter={() => isCollapsed && setHoveredItem('patentWriting')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <Link to="/claims" className={nav3styles.link}>
            <FaPenNib />
            {isCollapsed && hoveredItem === 'patentWriting' ? <span>claims自动撰写</span> : null}
          </Link>
        </li>
        <li
          onMouseEnter={() => isCollapsed && setHoveredItem('drugSearch')}
          onMouseLeave={() => setHoveredItem(null)}
        >
          <Link to="/search" className={nav3styles.link}>
            <FaSearch />
            {isCollapsed && hoveredItem === 'drugSearch' ? <span>数据库检索</span> : null}
          </Link>
        </li>
      </ul>
      <button onClick={toggleCollapse} className={nav3styles.toggleButton}>
        {isCollapsed ? '←' : '→'}
      </button>
    </nav>
  );
}

export default Nav;