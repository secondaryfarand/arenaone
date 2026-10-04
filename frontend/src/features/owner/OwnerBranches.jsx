import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE_URL } from '../../config/api';
import styles from './OwnerBranches.module.css';

export default function OwnerBranches() {
  const auth = useContext(AuthContext);

  // Ambil token dari AuthContext atau fallback ke localStorage
  const rawToken = auth?.token || localStorage.getItem('token');
  const token = typeof rawToken === 'object' && rawToken !== null ? rawToken.token : rawToken;

  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Modal State
  const [showModalBranch, setShowModalBranch] = useState(false);
  const [showModalField, setShowModalField] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(null);

  // Form State
  const [branchForm, setBranchForm] = useState({ name: '', address: '', phone: '' });
  const [fieldForm, setFieldForm] = useState({ name: '', type: 'Futsal', pricePerHour: '' });

  // 1. Fetch Branches (Tanpa menuliskan /api/v1 lagi di sini)
  const fetchBranches = useCallback(async () => {
    if (!token || token === 'undefined' || token === 'null') {
      console.warn('Token belum tersedia di AuthContext/localStorage');
      setErrorMsg('Sesi tidak ditemukan. Silakan login kembali.');
      setLoading(false);
      return;
    }

    try {
      setErrorMsg('');
      
      // KUNCI PERBAIKAN: Langsung panggil /branches/... karena API_BASE_URL sudah berisi /api/v1
      const targetUrl = `${API_BASE_URL}/branches/owner/branches`;
      console.log('Mengakses URL Target:', targetUrl);

      const res = await fetch(targetUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('HTTP Status Code:', res.status);

      if (!res.ok) {
        const errText = await res.text();
        console.error(`Server Error (${res.status}):`, errText);
        setErrorMsg(`Gagal memuat data cabang (HTTP ${res.status})`);
        return;
      }

      const data = await res.json();
      console.log('Data dari backend:', data);

      if (data.success) {
        setBranches(data.data || []);
      } else {
        setErrorMsg(data.message || 'Gagal mengambil data cabang.');
      }
    } catch (err) {
      console.error('Fetch Branches Error:', err);
      setErrorMsg('Gagal terhubung ke server backend.');
    } finally {
      // Dijamin selalu mematikan tampilan "Memuat data cabang..."
      setLoading(false);
    }
  }, [token]);

  // 2. Jalankan fetchBranches saat token siap
  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  // Handler Tambah Cabang
    const handleCreateBranch = async (e) => {
    e.preventDefault();

    const rawToken = auth?.token || localStorage.getItem('token');
    const token = typeof rawToken === 'object' && rawToken !== null ? rawToken.token : rawToken;

    if (!token) {
      alert('Sesi kadaluarsa, silakan re-login.');
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/branches/owner/branches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(branchForm)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setShowModalBranch(false);
        setBranchForm({ name: '', address: '', phone: '' });
        fetchBranches(); // Reload daftar cabang
      } else {
        console.error('Gagal tambah cabang:', data.message);
        alert(data.message || 'Gagal menambahkan cabang.');
      }
    } catch (err) {
      console.error('Create Branch Error:', err);
    }
  };

  // Handler Tambah Lapangan
  const handleCreateField = async (e) => {
    e.preventDefault();
    if (!token || !selectedBranchId) return;

    try {
      const res = await fetch(`${API_BASE_URL}/branches/owner/branches/${selectedBranchId}/fields`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(fieldForm)
      });

      if (res.ok) {
        setShowModalField(false);
        setFieldForm({ name: '', type: 'Futsal', pricePerHour: '' });
        fetchBranches();
      }
    } catch (err) {
      console.error('Create Field Error:', err);
    }
  };

  if (loading) {
    return <div className={styles.container}>Memuat data cabang...</div>;
  }

  if (errorMsg) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: 'red', fontWeight: 'bold' }}>⚠️ {errorMsg}</p>
        <button 
          onClick={fetchBranches}
          style={{ padding: '8px 16px', cursor: 'pointer', marginTop: '10px' }}
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2>Kelola Cabang & Lapangan</h2>
          <p>Atur lokasi arena dan daftar lapangan yang Anda miliki</p>
        </div>
        <button className={styles.btnPrimary} onClick={() => setShowModalBranch(true)}>
          <i className="fa-solid fa-plus"></i> Tambah Cabang
        </button>
      </div>

      {branches.length === 0 ? (
        <div className={styles.emptyState}>
          <i className="fa-solid fa-building-circle-exclamation"></i>
          <p>Belum ada cabang terdaftar. Silakan tambah cabang baru!</p>
        </div>
      ) : (
        <div className={styles.branchGrid}>
          {branches.map((branch) => (
            <div key={branch.id} className={styles.branchCard}>
              <div className={styles.branchHeader}>
                <h3>{branch.name}</h3>
                <span className={styles.phoneBadge}>
                  <i className="fa-solid fa-phone"></i> {branch.phone || '-'}
                </span>
              </div>
              <p className={styles.address}>
                <i className="fa-solid fa-location-dot"></i> {branch.address}
              </p>

              <div className={styles.fieldSection}>
                <div className={styles.fieldHeader}>
                  <h4>Daftar Lapangan ({branch.fields?.length || 0})</h4>
                  <button 
                    className={styles.btnSecondary}
                    onClick={() => {
                      setSelectedBranchId(branch.id);
                      setShowModalField(true);
                    }}
                  >
                    + Lapangan
                  </button>
                </div>

                <div className={styles.fieldList}>
                  {branch.fields?.length === 0 ? (
                    <p className={styles.noField}>Belum ada lapangan di cabang ini.</p>
                  ) : (
                    (branch.fields || []).map((field) => (
                      <div key={field.id} className={styles.fieldItem}>
                        <div>
                          <strong>{field.name}</strong>
                          <span className={styles.fieldType}>{field.type}</span>
                        </div>
                        <span className={styles.price}>
                          Rp {Number(field.pricePerHour).toLocaleString('id-ID')}/jam
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModalBranch && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Tambah Cabang Baru</h3>
            <form onSubmit={handleCreateBranch}>
              <div className={styles.formGroup}>
                <label>Nama Cabang</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Contoh: ArenaOne Denpasar"
                  value={branchForm.name}
                  onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Alamat</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Jl. Teuku Umar No. 12"
                  value={branchForm.address}
                  onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Nomor Telepon</label>
                <input 
                  type="text" 
                  placeholder="08123456789"
                  value={branchForm.phone}
                  onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })}
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.btnCancel} onClick={() => setShowModalBranch(false)}>Batal</button>
                <button type="submit" className={styles.btnPrimary}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showModalField && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Tambah Lapangan Baru</h3>
            <form onSubmit={handleCreateField}>
              <div className={styles.formGroup}>
                <label>Nama Lapangan</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Contoh: Lapangan A (Sintetis)"
                  value={fieldForm.name}
                  onChange={(e) => setFieldForm({ ...fieldForm, name: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Jenis Olahraga</label>
                <select 
                  value={fieldForm.type}
                  onChange={(e) => setFieldForm({ ...fieldForm, type: e.target.value })}
                >
                  <option value="Futsal">Futsal</option>
                  <option value="Badminton">Badminton</option>
                  <option value="Basketball">Basketball</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Harga Sewa per Jam (Rp)</label>
                <input 
                  type="number" 
                  required 
                  placeholder="80000"
                  value={fieldForm.pricePerHour}
                  onChange={(e) => setFieldForm({ ...fieldForm, pricePerHour: e.target.value })}
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.btnCancel} onClick={() => setShowModalField(false)}>Batal</button>
                <button type="submit" className={styles.btnPrimary}>Simpan Lapangan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}