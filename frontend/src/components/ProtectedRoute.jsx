import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

export const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token } = useContext(AuthContext);

  // 1. Ambil data cadangan langsung dari localStorage untuk menghindari lag pada state React
  const savedToken = token || localStorage.getItem('token');
  const savedUserRaw = localStorage.getItem('user');
  
  let currentUser = user;
  if (!currentUser && savedUserRaw && savedUserRaw !== 'undefined') {
    try {
      currentUser = JSON.parse(savedUserRaw);
    } catch (e) {
      currentUser = null;
    }
  }

  // Debugging log untuk melihat data di Console Browser
  console.log('--- PROTECTED ROUTE CHECK ---');
  console.log('Token:', savedToken);
  console.log('User Data:', currentUser);

  // 2. Jika token atau user tidak ada -> Tendang ke /login
  if (!savedToken || !currentUser) {
    console.warn('Akses ditolak: Tidak ada token/user. Redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // 3. Jika rute membutuhkan role spesifik, lakukan pengecekan tanpa memperdulikan kapitalisasi huruf (case-insensitive)
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = (currentUser.role || '').toUpperCase();
    const formattedAllowedRoles = allowedRoles.map(r => r.toUpperCase());

    console.log(`User Role: "${userRole}", Allowed Roles:`, formattedAllowedRoles);

    if (!formattedAllowedRoles.includes(userRole)) {
      console.warn('Akses ditolak: Role tidak cocok. Redirecting to /booking');
      return <Navigate to="/booking" replace />;
    }
  }

  // 4. Jika lolos verifikasi -> Izinkan akses ke komponen/halaman target
  return <Outlet />;
};