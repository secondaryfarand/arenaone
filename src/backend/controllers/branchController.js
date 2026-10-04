import { 
  createBranchService, 
  getBranchesByOwnerService, 
  updateBranchService, 
  deleteBranchService 
} from '../services/branchService.js';

export const createBranch = async (req, res) => {
  try {
    const branch = await createBranchService(req.body);
    return res.status(201).json({ success: true, data: branch });
  } catch (error) {
    console.error('[Create Branch Error]:', error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getOwnerBranches = async (req, res) => {
  try {
    const { ownerId } = req.params;
    const branches = await getBranchesByOwnerService(ownerId);
    return res.status(200).json({ success: true, data: branches });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const branch = await updateBranchService(id, req.body);
    return res.status(200).json({ success: true, data: branch });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteBranchService(id);
    return res.status(200).json({ success: true, message: 'Cabang berhasil dihapus' });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};