import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

export default function Navbar({ user }) {
  console.log('DATA USER DI NAVBAR:', user);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const rawRole = user?.role || user?.user?.role || user?.roleName || '';
  const userRole = rawRole.toLowerCase();
  const isOwner = userRole === 'owner';

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    closeMenu();
    navigate('/login');
  };

  const customerLinks = [
    { path: '/explore', label: 'Cari Lapangan', icon: 'fa-solid fa-magnifying-glass' },
    { path: '/my-bookings', label: 'Jadwal Saya', icon: 'fa-solid fa-calendar-check' },
  ];

  const ownerLinks = [
    { path: '/owner/dashboard', label: 'Dashboard', icon: 'fa-solid fa-chart-line' },
    { path: '/owner/branches', label: 'Kelola Lapangan', icon: 'fa-solid fa-futbol' },
    { path: '/owner/bookings', label: 'Pesanan Masuk', icon: 'fa-solid fa-receipt' },
  ];

  const navItems = isOwner ? ownerLinks : customerLinks;

  return (
    <>
      <nav className={styles.navbar}>
        <NavLink to="/" className={styles.logo} onClick={closeMenu}>
          <i className="fa-solid fa-bolt"></i>
          <span>ArenaOne</span>
        </NavLink>

        <button 
          className={`${styles.hamburger} ${isOpen ? styles.active : ''}`} 
          onClick={toggleMenu}
          aria-label="Toggle Navigation"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>

        <ul className={`${styles.navLinks} ${isOpen ? styles.open : ''}`}>
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => 
                  `${styles.navLink} ${isActive ? styles.activeLink : ''}`
                }
                onClick={closeMenu}
              >
                <i className={item.icon}></i>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}

          <li>
            <span className={styles.roleBadge}>
              <i className={`fa-solid ${isOwner ? 'fa-user-gear' : 'fa-user-shield'}`}></i>
              {isOwner ? 'Owner' : 'User'}
            </span>
          </li>

          <li>
            <button className={styles.logoutBtn} onClick={handleLogout}>
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </nav>

      {isOpen && (
        <div className={styles.overlay} onClick={closeMenu}></div>
      )}
    </>
  );
}