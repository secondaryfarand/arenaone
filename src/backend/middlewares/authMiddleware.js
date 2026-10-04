import { verifyToken } from '../utils/jwt.js';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token || token === 'undefined') {
    return res.status(401).json({ success: false, message: 'Token tidak ada' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next(); // <--- WAJIB DIPANGGIL! Jika lupa, request menggantung.
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Token tidak valid' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Akses ditolak: Peran ${req.user?.role || 'tanpa peran'} tidak memiliki hak akses` 
      });
    }
    next();
  };
};

export default {
  authenticateToken,
  authorizeRoles
};