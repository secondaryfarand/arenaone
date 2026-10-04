import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import userRoutes from './routes/userRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import posRoutes from './routes/posRoutes.js';
import branchRoutes from './routes/branchRoutes.js';
import fieldRoutes from './routes/fieldRoutes.js';
import authRoutes from './routes/authRoutes.js';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.use(cors());
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/booking', bookingRoutes);
app.use('/api/v1/pos', posRoutes);
app.use('/api/v1/branches', branchRoutes);
app.use('/api/v1/fields', fieldRoutes);
app.use('/api/v1/auth', authRoutes);


const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

app.get('{/*path}', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  }
});

app.use((err, req, res, next) => {
  console.error('Server Unhandled Error:', err);
  res.status(500).json({
    success: false,
    message: err.message || 'Terjadi kesalahan internal pada server'
  });
});

app.listen(PORT, () => {
  console.log(`[arenaone] Server running on http://localhost:${PORT}`);
});