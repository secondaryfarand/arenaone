import { 
  findAllFields, 
  createField, 
  createBooking, 
  findBookingsByDate 
} from '../models/bookingModel.js';

export const getAllFieldsService = async () => {
  return await findAllFields();
};

export const addFieldService = async (fieldData) => {
  if (!fieldData.name || !fieldData.pricePerHour) {
    throw new Error('Nama lapangan dan harga per jam wajib diisi');
  }
  return await createField({
    name: fieldData.name,
    type: fieldData.type || 'Futsal',
    pricePerHour: fieldData.pricePerHour
  });
};

export const createBookingService = async (bookingData) => {
  const { userId, fieldId, bookingDate, startTime, endTime, totalPrice } = bookingData;

  if (!userId || !fieldId || !bookingDate || !startTime || !endTime) {
    throw new Error('Data sewa lapangan tidak lengkap');
  }

  return await createBooking({
    userId,
    fieldId,
    bookingDate: new Date(bookingDate),
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    totalPrice
  });
};

export const getBookingsByDateService = async (date) => {
  return await findBookingsByDate(date);
};