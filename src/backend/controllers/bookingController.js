import { 
  getAllFieldsService, 
  addFieldService, 
  createBookingService, 
  getBookingsByDateService 
} from '../services/bookingService.js';

export const getFields = async (req, res) => {
  try {
    const fields = await getAllFieldsService();
    return res.status(200).json({ success: true, data: fields });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const addField = async (req, res) => {
  try {
    const newField = await addFieldService(req.body);
    return res.status(201).json({ success: true, data: newField });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const addBooking = async (req, res) => {
  try {
    const booking = await createBookingService(req.body);
    return res.status(201).json({ success: true, data: booking });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getBookings = async (req, res) => {
  try {
    const { date } = req.query;
    const bookings = await getBookingsByDateService(date || new Date().toISOString().split('T')[0]);
    return res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};