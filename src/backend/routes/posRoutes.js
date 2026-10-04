import { Router } from 'express';
import { getProducts, addProduct, checkoutPOS } from '../controllers/posController.js';

const router = Router();

router.get('/products', getProducts);
router.post('/products', addProduct);
router.post('/checkout', checkoutPOS);

export default router;