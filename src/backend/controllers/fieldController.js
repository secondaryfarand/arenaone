import { 
  createFieldService, 
  getFieldsByBranchService, 
  updateFieldService, 
  deleteFieldService 
} from '../services/fieldService.js';

export const createField = async (req, res) => {
  try {
    const field = await createFieldService(req.body);
    return res.status(201).json({ success: true, data: field });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getBranchFields = async (req, res) => {
  try {
    const { branchId } = req.params;
    const fields = await getFieldsByBranchService(branchId);
    return res.status(200).json({ success: true, data: fields });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateField = async (req, res) => {
  try {
    const { id } = req.params;
    const field = await updateFieldService(id, req.body);
    return res.status(200).json({ success: true, data: field });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteField = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteFieldService(id);
    return res.status(200).json({ success: true, message: 'Lapangan berhasil dihapus' });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};