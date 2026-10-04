import { Router } from 'express';
import { 
  createBranch, 
  getOwnerBranches, 
  updateBranch, 
  deleteBranch 
} from '../controllers/branchController.js';

const router = Router();

router.post('/', createBranch);
router.get('/owner/:ownerId', getOwnerBranches);
router.put('/:id', updateBranch);
router.delete('/:id', deleteBranch);

export default router;