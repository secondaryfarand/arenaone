import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Nama, email, dan password wajib diisi' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email sudah terdaftar' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role && ['ADMIN', 'OWNER', 'CUSTOMER'].includes(role) ? role : 'CUSTOMER';

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole
      }
    });

        const token = generateToken(user);

        return res.status(201).json({
        success: true,
        message: 'Registrasi berhasil',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
  } catch (error) {
    console.error("Error pada Register Backend:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Terjadi kesalahan di server' 
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Email atau password salah' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: 'Email atau password salah' });
    }

    const token = generateToken(user);

    return res.status(200).json({
    success: true,
    message: 'Login berhasil',
    token,
    user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};