import prisma from '../config/prisma.js';

export const createFieldInDb = async (data) => {
  return await prisma.field.create({ data });
};

export const getFieldsByBranchFromDb = async (branchId) => {
  return await prisma.field.findMany({
    where: { branchId }
  });
};

export const updateFieldInDb = async (id, data) => {
  return await prisma.field.update({
    where: { id },
    data
  });
};

export const deleteFieldFromDb = async (id) => {
  return await prisma.field.delete({
    where: { id }
  });
};