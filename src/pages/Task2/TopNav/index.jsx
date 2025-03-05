import React from 'react';
import topnavstyles from './index.module.scss';
import { useNavigate } from 'react-router-dom';

function TopNav({ selectedTab, setSelectedTab }) {
  const navigate = useNavigate();

  const handleTabChange = (tab, path) => {
    setSelectedTab(tab);
    navigate(path);
  };

  return (
    <nav className={topnavstyles.topNav}>
      <div className={topnavstyles.menu}>
      <div
        className={`${topnavstyles.navItem} ${selectedTab === 'createtask' ? topnavstyles.activeTab : ''}`}
        onClick={() => handleTabChange('createtask', '/task')}
      >
        创建任务
      </div>
      <div
        className={`${topnavstyles.navItem} ${selectedTab === 'results' ? topnavstyles.activeTab : ''}`}
        onClick={() => handleTabChange('results', '/task/results')}
      >
        结果列表
      </div>
      <div
        className={`${topnavstyles.navItem} ${selectedTab === 'favorites' ? topnavstyles.activeTab : ''}`}
        onClick={() => handleTabChange('favorites', '/task/favorites')}
      >
        收藏列表
      </div>
      </div>
      {/* 选择条 */}
      <div className={topnavstyles.selectionBar}></div>
    </nav>
  );
}

export default TopNav;
