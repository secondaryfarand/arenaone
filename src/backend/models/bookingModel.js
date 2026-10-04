import prisma from '../config/prisma.js';

export const findAllFields = async () => {
  return await prisma.field.findMany();
};

export const createField = async (data) => {
  return await prisma.field.create({ data });
};

export const createBooking = async (data) => {
  return await prisma.booking.create({
    data,
    include: { field: true, user: true }
  });
};

export const findBookingsByDate = async (date) => {
  return await prisma.booking.findMany({
    where: {
      bookingDate: new Date(date)
    },
    include: { field: true, user: true }
  });
};