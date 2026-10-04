import prisma from '../config/prisma.js';

export const findAllProducts = async () => {
  return await prisma.product.findMany({
    include: { category: true }
  });
};

export const createProduct = async (data) => {
  return await prisma.product.create({ data });
};

export const createOrderTransaction = async ({ userId, totalAmount, items }) => {
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        userId,
        totalAmount,
        status: 'PAID'
      }
    });

    for (const item of items) {
      await tx.orderItem.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price
        }
      });

      await tx.product.update({
        where: { id: item.productId },
        data: {
          stock: { decrement: item.quantity }
        }
      });
    }

    return order;
  });
};