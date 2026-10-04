import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getOwnerBranches = async (req, res) => {
  try {
    const ownerId = req.user.id; // Diambil dari token
    
    // Sesuaikan query dengan ORM/Database kamu (Prisma/MongoDB)
    const branches = await prisma.branch.findMany({
      where: { ownerId: ownerId },
      include: { 
        fields: true 
      }
    });

    // PASTI KIRIM RESPON
    return res.status(200).json({
      success: true,
      data: branches
    });
  } catch (error) {
    console.error('Error in getOwnerBranches:', error);
    // JIKA ERROR, WAJIB BERI RESPON AGAR FRONTEND TIDAK HANGING
    return res.status(500).json({
      success: false,
      message: error.message || 'Internal Server Error'
    });
  }
};

// controllers/branchController.js
export const createBranch = async (req, res) => {
  try {
    const { name, address, phone } = req.body;
    
    // Pastikan req.user.id ada (di-set oleh authMiddleware)
    const ownerId = req.user?.id || req.user?.userId;

    if (!name || !address) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nama dan alamat cabang wajib diisi' 
      });
    }

    const newBranch = await prisma.branch.create({
      data: {
        name,
        address,
        phone,
        ownerId // Sesuaikan nama relasi ke User (Owner) di schema.prisma
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Cabang berhasil ditambahkan',
      data: newBranch
    });
  } catch (error) {
    console.error('Error saat membuat cabang:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Gagal menambahkan cabang ke database'
    });
  }
};

const createField = async (req, res) => {
  try {
    const { branchId } = req.params;
    const { name, type, pricePerHour } = req.body;

    const newField = await prisma.field.create({
      data: {
        name,
        type,
        pricePerHour: Number(pricePerHour),
        branchId
      }
    });

    res.status(201).json({ success: true, data: newField });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Penyesuaian stubs untuk update & delete agar tidak error saat dipanggil router
const updateBranch = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, phone } = req.body;
    const updated = await prisma.branch.update({
      where: { id },
      data: { name, address, phone }
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteBranch = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.branch.delete({ where: { id } });
    res.json({ success: true, message: 'Cabang berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export default {
  getOwnerBranches,
  createBranch,
  createField,
  updateBranch,
  deleteBranch
};