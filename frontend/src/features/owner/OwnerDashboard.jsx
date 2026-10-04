import React, { useState, useEffect } from 'react';
import styles from './OwnerDashboard.module.css';

export const OwnerDashboard = () => {
  const [branches, setBranches] = useState([]);
  const ownerId = "DUMMY_OWNER_ID"; // Nanti diganti dengan ID dari state/context auth

  // State Modal Cabang
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchForm, setBranchForm] = useState({ name: '', address: '', phone: '' });

  // State Modal Lapangan
  const [isFieldModalOpen, setIsFieldModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [activeBranchId, setActiveBranchId] = useState(null);
  const [fieldForm, setFieldForm] = useState({ name: '', type: 'Futsal', pricePerHour: '' });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/v1/branches/owner/${ownerId}`);
      const data = await res.json();
      if (data.success) {
        setBranches(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // --- HANDLER CABANG ---
  const handleOpenBranchModal = (branch = null) => {
    if (branch) {
      setSelectedBranch(branch);
      setBranchForm({ name: branch.name, address: branch.address, phone: branch.phone || '' });
    } else {
      setSelectedBranch(null);
      setBranchForm({ name: '', address: '', phone: '' });
    }
    setIsBranchModalOpen(true);
  };

  const handleSaveBranch = async (e) => {
    e.preventDefault();
    const url = selectedBranch 
      ? `http://localhost:5000/api/v1/branches/${selectedBranch.id}`
      : `http://localhost:5000/api/v1/branches`;
    const method = selectedBranch ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...branchForm, ownerId })
      });
      const data = await res.json();
      if (data.success) {
        setIsBranchModalOpen(false);
        fetchBranches();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBranch = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus cabang ini beserta seluruh lapangannya?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/v1/branches/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchBranches();
    } catch (err) {
      console.error(err);
    }
  };

  // --- HANDLER LAPANGAN ---
  const handleOpenFieldModal = (branchId, field = null) => {
    setActiveBranchId(branchId);
    if (field) {
      setSelectedField(field);
      setFieldForm({ name: field.name, type: field.type, pricePerHour: field.pricePerHour });
    } else {
      setSelectedField(null);
      setFieldForm({ name: '', type: 'Futsal', pricePerHour: '' });
    }
    setIsFieldModalOpen(true);
  };

  const handleSaveField = async (e) => {
    e.preventDefault();
    const url = selectedField 
      ? `http://localhost:5000/api/v1/fields/${selectedField.id}`
      : `http://localhost:5000/api/v1/fields`;
    const method = selectedField ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fieldForm, pricePerHour: Number(fieldForm.pricePerHour), branchId: activeBranchId })
      });
      const data = await res.json();
      if (data.success) {
        setIsFieldModalOpen(false);
        fetchBranches();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteField = async (id) => {
    if (!confirm('Hapus lapangan ini?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/v1/fields/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) fetchBranches();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Menu Owner</div>
        <div style={{ fontWeight: 600, color: 'var(--primary)', cursor: 'pointer' }}>
          Manajemen Arena & Cabang
        </div>
      </aside>

      <main className={styles.content}>
        <div className={styles.header}>
          <div>
            <h1>Kelola Cabang & Lapangan</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Atur daftar venue arena olahraga dan fasilitas lapangan Anda.
            </p>
          </div>
          <button className={styles.primaryBtn} onClick={() => handleOpenBranchModal()}>
            + Tambah Cabang
          </button>
        </div>

        <div className={styles.cardGrid}>
          {branches.map((branch) => (
            <div key={branch.id} className={styles.branchCard}>
              <div className={styles.branchCardHeader}>
                <div>
                  <div className={styles.branchName}>{branch.name}</div>
                  <div className={styles.branchAddress}>{branch.address}</div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button className={styles.editBtn} onClick={() => handleOpenBranchModal(branch)}>Edit</button>
                  <button className={styles.dangerBtn} onClick={() => handleDeleteBranch(branch.id)}>Hapus</button>
                </div>
              </div>

              <div className={styles.fieldList}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <strong style={{ fontSize: '0.85rem' }}>Daftar Lapangan</strong>
                  <button 
                    style={{ border: 'none', background: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.8rem' }}
                    onClick={() => handleOpenFieldModal(branch.id)}
                  >
                    + Lapangan
                  </button>
                </div>
                {branch.fields && branch.fields.map((field) => (
                  <div key={field.id} className={styles.fieldItem}>
                    <div>
                      <span>{field.name}</span>
                      <span className={styles.typeBadge}>{field.type}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong>Rp {Number(field.pricePerHour).toLocaleString('id-ID')}/jam</strong>
                      <button className={styles.iconBtn} onClick={() => handleOpenFieldModal(branch.id, field)}>✎</button>
                      <button className={styles.iconBtnDanger} onClick={() => handleDeleteField(field.id)}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- MODAL CABANG --- */}
      {isBranchModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>{selectedBranch ? 'Edit Cabang' : 'Tambah Cabang Baru'}</h3>
            <form onSubmit={handleSaveBranch}>
              <div className={styles.formGroup}>
                <label>Nama Cabang / Arena</label>
                <input 
                  type="text" 
                  value={branchForm.name} 
                  onChange={(e) => setBranchForm({ ...branchForm, name: e.target.value })} 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Alamat Lengkap</label>
                <input 
                  type="text" 
                  value={branchForm.address} 
                  onChange={(e) => setBranchForm({ ...branchForm, address: e.target.value })} 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Nomor Telepon / WhatsApp</label>
                <input 
                  type="text" 
                  value={branchForm.phone} 
                  onChange={(e) => setBranchForm({ ...branchForm, phone: e.target.value })} 
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsBranchModalOpen(false)}>Batal</button>
                <button type="submit" className={styles.primaryBtn}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL LAPANGAN --- */}
      {isFieldModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>{selectedField ? 'Edit Lapangan' : 'Tambah Lapangan Baru'}</h3>
            <form onSubmit={handleSaveField}>
              <div className={styles.formGroup}>
                <label>Nama Lapangan (e.g. Lapangan A, Court 1)</label>
                <input 
                  type="text" 
                  value={fieldForm.name} 
                  onChange={(e) => setFieldForm({ ...fieldForm, name: e.target.value })} 
                  required 
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
                  <option value="Basket">Basket</option>
                  <option value="Voli">Voli</option>
                  <option value="Mini Soccer">Mini Soccer</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Harga per Jam (Rp)</label>
                <input 
                  type="number" 
                  value={fieldForm.pricePerHour} 
                  onChange={(e) => setFieldForm({ ...fieldForm, pricePerHour: e.target.value })} 
                  required 
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsFieldModalOpen(false)}>Batal</button>
                <button type="submit" className={styles.primaryBtn}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};