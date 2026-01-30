export const sampleOrderStatuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

export const createSampleOrder = (userId, items, shippingAddress, paymentMethod) => {
  const orderId = 'ORD' + Date.now();
  const placedAt = new Date().toISOString();
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = 0;
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = Math.round((subtotal - discount + shipping) * 0.18);
  const total = subtotal - discount + shipping + tax;

  return {
    orderId,
    userId,
    items,
    shippingAddress,
    paymentMethod,
    amounts: { subtotal, discount, shipping, tax, total },
    status: 'Processing',
    placedAt,
    estimatedDelivery: estimatedDelivery.toISOString(),
  };
};
