import { useContext } from 'react';
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar.jsx';

import { AuthContext } from '../context/AuthContext'; // Sesuaikan path AuthContext Anda

const MainLayout = () => {
  const { user } = useContext(AuthContext);
  return (
    <div>
      <Navbar user={user}/>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;