import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser && savedUser !== 'undefined') {
      try { 
        const parsed = JSON.parse(savedUser);
        // Pastikan jika data tersimpan dalam bentuk bertumpuk, ambil objek user bagian dalam
        return parsed?.user || parsed;
      } catch (e) { 
        return null; 
      }
    }
    return null;
  });

  const [token, setToken] = useState(() => {
    const savedToken = localStorage.getItem('token');
    return savedToken && savedToken !== 'undefined' ? savedToken : null;
  });

  const loginUser = (userData, authToken) => {
    console.log('Menerima loginUser raw:', { userData, authToken });

    // 1. Ekstrak objek user yang sebenarnya (mengatasi tumpukan userData.user)
    const actualUser = userData?.user || userData;

    // 2. Ekstrak token (ambil dari authToken atau dari userData.token jika authToken undefined)
    const actualToken = authToken || userData?.token;

    if (actualUser) {
      setUser(actualUser);
      localStorage.setItem('user', JSON.stringify(actualUser));
    }

    if (actualToken) {
      setToken(actualToken);
      localStorage.setItem('token', actualToken);
    }
  };

  const logoutUser = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};