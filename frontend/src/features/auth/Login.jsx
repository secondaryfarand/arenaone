import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';

export const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';
      
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

        const data = await res.json();
        console.log('--- RESPONS BACKEND LOGIN ---', data);

        if (res.ok && data.success) {
        // Ambil user dan token dengan fallback aman
        const userObj = data.user || data.data;
        const tokenStr = data.token;

        // SIMPAN DULU KE LOCALSTORAGE LANGSUNG
        localStorage.setItem('user', JSON.stringify(userObj));
        localStorage.setItem('token', tokenStr);

        // Simpan ke State Context
        loginUser(userObj, tokenStr);

        // Tentukan rute
        const userRole = (userObj?.role || '').toUpperCase();
        const targetPath = userRole === 'OWNER' ? '/owner' : '/booking';

        // Redirect
        navigate(targetPath, { replace: true });
        } else {
        setError(data.message || 'Login gagal, periksa email/password');
        }
    } catch (err) {
        console.error('Error Login:', err);
        setError('Gagal terhubung ke server');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fff' }}>
      <h2 style={{ marginBottom: '1rem', color: '#1e293b' }}>Login ArenaOne</h2>
      
      {error && (
        <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '6px', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 600 }}>Email</label>
          <input 
            type="email" 
            style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
            value={form.email} 
            onChange={(e) => setForm({ ...form, email: e.target.value })} 
            required 
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 600 }}>Password</label>
          <input 
            type="password" 
            style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px' }} 
            value={form.password} 
            onChange={(e) => setForm({ ...form, password: e.target.value })} 
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer' }}
        >
          {loading ? 'Memproses...' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
        Belum punya akun? <Link to="/register" style={{ color: '#0284c7', fontWeight: 600 }}>Daftar di sini</Link>
      </p>
    </div>
  );
};