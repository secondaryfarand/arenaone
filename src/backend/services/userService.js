import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/userModel.js';

export const registerUserService = async ({ name, email, password, role }) => {
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new Error('Email sudah terdaftar');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await createUser({
    name,
    email,
    password: hashedPassword,
    role: role || 'CUSTOMER'
  });

  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const loginUserService = async ({ email, password }) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Email atau password salah');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Email atau password salah');
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET || 'arenaone_secret_key',
    { expiresIn: '1d' }
  );

  const { password: _, ...userData } = user;
  return { user: userData, token };
};