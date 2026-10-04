import { getAllProductsService, addProductService, checkoutPosService } from '../services/posService.js';

export const getProducts = async (req, res) => {
  try {
    const products = await getAllProductsService();
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const product = await addProductService(req.body);
    return res.status(201).json({ success: true, data: product });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const checkoutPOS = async (req, res) => {
  try {
    const order = await checkoutPosService(req.body);
    return res.status(201).json({ success: true, data: order });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};