import { 
  createFieldInDb, 
  getFieldsByBranchFromDb, 
  updateFieldInDb, 
  deleteFieldFromDb 
} from '../models/fieldModel.js';

export const createFieldService = async ({ name, type, pricePerHour, branchId }) => {
  if (!name || !pricePerHour || !branchId) {
    throw new Error('Nama lapangan, harga per jam, dan Cabang ID wajib diisi');
  }
  return await createFieldInDb({ name, type: type || 'Futsal', pricePerHour, branchId });
};

export const getFieldsByBranchService = async (branchId) => {
  if (!branchId) {
    throw new Error('Branch ID diperlukan');
  }
  return await getFieldsByBranchFromDb(branchId);
};

export const updateFieldService = async (id, updateData) => {
  return await updateFieldInDb(id, updateData);
};

export const deleteFieldService = async (id) => {
  return await deleteFieldFromDb(id);
};