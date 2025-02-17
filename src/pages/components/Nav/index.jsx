import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import nav2styles from './index.module.scss';
import { FaFileAlt, FaPenNib, FaSearch } from 'react-icons/fa';
import { FaAirbnb } from 'react-icons/fa6';

function Nav(props) {
  return (
    <nav className={nav2styles.nav}>
      <ul>
        <li className={nav2styles.navItem}>
          <Link to="/markdown" className={nav2styles.link}>
            <FaAirbnb className={nav2styles.icon} />
          </Link>
        </li>
        <li className={nav2styles.navItem}>
          <Link to="/result" className={nav2styles.link}>
            <FaFileAlt className={nav2styles.icon} />
          </Link>
        </li>
        <li className={nav2styles.navItem}>
          <Link to="/claims" className={nav2styles.link}>
            <FaPenNib className={nav2styles.icon} />
          </Link>
        </li>
        <li className={nav2styles.navItem}>
          <Link to="/search/main" className={nav2styles.link}>
            <FaSearch className={nav2styles.icon} />
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
