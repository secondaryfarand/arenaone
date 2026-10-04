import { Router } from 'express';
import { getFields, addField, addBooking, getBookings } from '../controllers/bookingController.js';

const router = Router();

router.get('/fields', getFields);
router.post('/fields', addField);
router.get('/schedule', getBookings);
router.post('/book', addBooking);

export default router;