import React from 'react';
import Header2 from '../../components/Header/index2';
import Nav from '../../components/Nav';
import mylayout4styles from './index.module.scss';
import { Outlet } from 'react-router-dom';
const Layout4 = ({ children }) => {
  return (
    <div className={mylayout4styles.layout}>
      <Header2 />
      <div className={mylayout4styles.mainContent}>
        <Nav />
        <Outlet />
          {children}  
      </div>
    </div>
  );
};

export default Layout4;