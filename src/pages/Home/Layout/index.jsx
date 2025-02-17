import React from 'react';
import Header from '../../components/Header/index1';
import Nav from '../../components/Nav';
import layoutstyles from './index.module.scss';
import { Outlet } from 'react-router-dom';
const Layout = ({ children }) => {
  return (
    <div className={layoutstyles.layout}>
      <Header />
      <div className={layoutstyles.mainContent}>
        <Nav />
        <Outlet />
          {children}  
      </div>
    </div>
  );
};

export default Layout;