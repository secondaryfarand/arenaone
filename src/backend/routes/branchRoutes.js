import { Router } from 'express';
import branchController from '../controllers/branchController.js';
import { verifyToken } from '../utils/jwt.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = Router();

// URL jadinya: /api/v1/branches/owner
router.get('/owner/branches', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('OWNER'), branchController.getOwnerBranches);
router.post('/owner/branches', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('OWNER'), branchController.createBranch);
router.post('/owner/branches/:branchId/fields', authMiddleware.authenticateToken, authMiddleware.authorizeRoles('OWNER'), branchController.createField);

export default router;