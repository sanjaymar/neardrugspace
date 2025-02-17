import React from 'react';
import Header2 from '../../components/Header/index2';
import Nav from '../../components/Nav';
import mylayout3styles from './index.module.scss';
import { Outlet } from 'react-router-dom';
const Layout3 = ({ children }) => {
  return (
    <div className={mylayout3styles.layout}>
      <Header2 />
      <div className={mylayout3styles.mainContent}>
        <Nav />
        <Outlet />
          {children}  
      </div>
    </div>
  );
};

export default Layout3;