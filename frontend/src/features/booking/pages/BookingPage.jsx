import React, { useState, useEffect } from 'react';
import styles from './BookingPage.module.css';
import cardStyles from '../components/BookingCard.module.css';
import { Button } from '../../../components/Button/Button.jsx';

export const BookingPage = () => {
  const [fields, setFields] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/v1/booking/fields')
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success) {
          setFields(resData.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.headerSection}>
        <h1>Jadwal & Booking Lapangan</h1>
        <p>Pilih arena olahraga dan tentukan slot jam sewa Anda secara real-time.</p>
      </div>

      <div className={styles.grid}>
        {fields.map((field) => (
          <div key={field.id} className={cardStyles.card}>
            <div className={cardStyles.cardHeader}>
              <h3 className={cardStyles.title}>{field.name}</h3>
              <span className={cardStyles.badge}>{field.type}</span>
            </div>
            <div className={cardStyles.price}>
              Rp {Number(field.pricePerHour).toLocaleString('id-ID')} <span>/ jam</span>
            </div>
            <Button style={{ marginTop: '1.25rem', width: '100%' }}>
              Pilih Jam Sewa
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};