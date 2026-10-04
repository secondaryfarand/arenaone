import { registerUserService, loginUserService } from '../services/userService.js';

export const register = async (req, res) => {
  try {
    const user = await registerUserService(req.body);
    return res.status(201).json({
      success: true,
      message: 'Registrasi berhasil',
      data: user
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginUserService(req.body);
    return res.status(200).json({
      success: true,
      message: 'Login berhasil',
      data: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};