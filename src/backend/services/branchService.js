import { 
  createBranchInDb, 
  getBranchesByOwnerFromDb, 
  updateBranchInDb, 
  deleteBranchFromDb 
} from '../models/branchModel.js';

export const createBranchService = async ({ name, address, phone, ownerId }) => {
  if (!name || !address || !ownerId) {
    throw new Error('Nama cabang, alamat, dan Owner ID wajib diisi');
  }
  return await createBranchInDb({ name, address, phone, ownerId });
};

export const getBranchesByOwnerService = async (ownerId) => {
  if (!ownerId) {
    throw new Error('Owner ID diperlukan');
  }
  return await getBranchesByOwnerFromDb(ownerId);
};

export const updateBranchService = async (id, updateData) => {
  return await updateBranchInDb(id, updateData);
};

export const deleteBranchService = async (id) => {
  return await deleteBranchFromDb(id);
};