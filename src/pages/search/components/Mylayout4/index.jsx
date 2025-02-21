import React from 'react';
import Header from './components/Header';
import Nav from './components/Nav';
import mylayout4styles from './index.module.scss';
import { Outlet } from 'react-router-dom';
const MyLayout4 = ({ children }) => {
  return (
    <div className={mylayout4styles.layout}>
      <Header />
      <div className={mylayout4styles.mainContent}>
        <Nav />
        <Outlet />
          {children}  
      </div>
    </div>
  );
};

export default MyLayout4;