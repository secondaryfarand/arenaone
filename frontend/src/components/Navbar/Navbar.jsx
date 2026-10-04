import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

export const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <Link to="/" className={styles.brand}>
        arena<span>one</span>
      </Link>
      <ul className={styles.navLinks}>
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            end
          >
            Beranda
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/booking" 
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Sewa Lapangan
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/pos" 
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
          >
            Kantin & POS
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;