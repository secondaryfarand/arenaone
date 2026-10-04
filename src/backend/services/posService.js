import { findAllProducts, createProduct, createOrderTransaction } from '../models/posModel.js';

export const getAllProductsService = async () => {
  return await findAllProducts();
};

export const addProductService = async (productData) => {
  if (!productData.name || !productData.price || !productData.categoryId) {
    throw new Error('Nama produk, harga, dan kategori wajib diisi');
  }
  return await createProduct(productData);
};

export const checkoutPosService = async ({ userId, items, totalAmount }) => {
  if (!items || items.length === 0) {
    throw new Error('Keranjang belanja tidak boleh kosong');
  }
  return await createOrderTransaction({ userId, items, totalAmount });
};