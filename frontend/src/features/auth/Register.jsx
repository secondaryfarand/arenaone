import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';

export const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER' // Default role
  });
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

      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

        const data = await res.json();

        if (res.ok && data.success && data.user) {
        // 1. Simpan user & token ke AuthContext/localStorage
        loginUser(data.user, data.token);

        // 2. Ambil role user
        const userRole = (data.user.role || '').toUpperCase();

        // 3. Tentukan rute tujuan
        const targetPath = userRole === 'OWNER' ? '/owner' : '/booking';

        // 4. Lakukan redirect langsung
        navigate(targetPath, { replace: true });
        } else {
        setError(data.message || 'Registrasi gagal');
        }
    } catch (err) {
        console.error('Catch Error Register:', err);
        setError('Gagal terhubung ke server');
    } finally {
        setLoading(false);
    }
    };

  return (
    <div style={{ maxWidth: '420px', margin: '4rem auto', padding: '2rem', border: '1px solid #e2e8f0', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ marginBottom: '0.5rem', color: '#1e293b' }}>Daftar Akun ArenaOne</h2>
      <p style={{ marginBottom: '1.5rem', fontSize: '0.875rem', color: '#64748b' }}>
        Buat akun baru untuk mengelola venue atau melakukan booking arena.
      </p>

      {error && (
        <div style={{ padding: '0.75rem', marginBottom: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '6px', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Nama Lengkap</label>
          <input 
            type="text" 
            style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }} 
            value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} 
            placeholder="John Doe"
            required 
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Email</label>
          <input 
            type="email" 
            style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }} 
            value={form.email} 
            onChange={(e) => setForm({ ...form, email: e.target.value })} 
            placeholder="email@example.com"
            required 
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Password</label>
          <input 
            type="password" 
            style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none' }} 
            value={form.password} 
            onChange={(e) => setForm({ ...form, password: e.target.value })} 
            placeholder="••••••••"
            required 
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.35rem', fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>Daftar Sebagai</label>
          <select 
            style={{ width: '100%', padding: '0.6rem', border: '1px solid #cbd5e1', borderRadius: '6px', outline: 'none', backgroundColor: '#fff' }}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="CUSTOMER">Pengguna / Pemesan Arena (Customer)</option>
            <option value="OWNER">Pemilik Arena / Cabang (Owner)</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
        </button>
      </form>

      <p style={{ marginTop: '1.25rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
        Sudah memiliki akun? <Link to="/login" style={{ color: '#0284c7', textDecoration: 'none', fontWeight: 600 }}>Login di sini</Link>
      </p>
    </div>
  );
};