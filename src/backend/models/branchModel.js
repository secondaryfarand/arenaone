import prisma from '../config/prisma.js';

export const createBranchInDb = async (data) => {
  return await prisma.branch.create({ data });
};

export const getBranchesByOwnerFromDb = async (ownerId) => {
  return await prisma.branch.findMany({
    where: { ownerId },
    include: { fields: true }
  });
};

export const updateBranchInDb = async (id, data) => {
  return await prisma.branch.update({
    where: { id },
    data
  });
};

export const deleteBranchFromDb = async (id) => {
  return await prisma.branch.delete({
    where: { id }
  });
};