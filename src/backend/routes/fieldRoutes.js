import { Router } from 'express';
import { 
  createField, 
  getBranchFields, 
  updateField, 
  deleteField 
} from '../controllers/fieldController.js';

const router = Router();

router.post('/', createField);
router.get('/branch/:branchId', getBranchFields);
router.put('/:id', updateField);
router.delete('/:id', deleteField);

export default router;