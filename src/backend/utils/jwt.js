import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_key_fallback';

export const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '1d' }
  );
};

export const verifyToken = (token) => {
  if (!token || typeof token !== 'string' || token === 'undefined') {
    throw new Error('Token tidak ditemukan atau bukan string valid');
  }

  return jwt.verify(token, JWT_SECRET);
};