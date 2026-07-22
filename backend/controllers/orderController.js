const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');

// @desc    Create a new order from the items/shipping info sent by the client
// @route   POST /api/orders
// @access  Private
// @body    { items: [{product, name, image, shade, price, quantity}], shippingAddress, paymentMethod }
const createOrder = asyncHandler(async (req, res) => {
  const { items, shippingAddress, paymentMethod } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }
  if (!shippingAddress) {
    res.status(400);
    throw new Error('Shipping address is required');
  }

  const itemsPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingPrice = itemsPrice > 999 ? 0 : 49; // free shipping over ₹999, adjust as needed
  const totalPrice = itemsPrice + shippingPrice;

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod: paymentMethod || 'cod',
    itemsPrice,
    shippingPrice,
    totalPrice,
  });

  res.status(201).json({ success: true, order });
});

// @desc    Get the logged-in user's own orders
// @route   GET /api/orders/my
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @desc    Get a single order by id (owner or admin only)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isOwner = order.user._id.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';
  if (!isOwner && !isAdmin) {
    res.status(403);
    throw new Error('Not authorized to view this order');
  }

  res.json({ success: true, order });
});

// ---------------- Admin ----------------

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.status = status;
  if (status === 'delivered') {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }

  await order.save();
  res.json({ success: true, order });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};