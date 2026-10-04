import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';

import { AuthProvider } from './context/AuthContext.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';

import { Login } from './features/auth/Login.jsx';
import { Register } from './features/auth/Register.jsx'; // Jika ada Register
import { BookingPage } from './features/booking/pages/BookingPage.jsx';
import { OwnerDashboard } from './features/owner/OwnerDashboard.jsx';
import OwnerBranches from './features/owner/OwnerBranches';

export function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<BookingPage />} />
          <Route path="/booking" element={<BookingPage />} />
        </Route>

        {/* 2. Halaman Autentikasi (Tanpa MainLayout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* 3. Halaman Terproteksi khusus Role OWNER */}
        <Route element={<ProtectedRoute allowedRoles={['OWNER']} />}>
          <Route path="/owner" element={<OwnerDashboard />} />
          <Route path="/owner/branches" element={<OwnerBranches />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;