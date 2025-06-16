// routes/orderRoutes.js
const express = require('express');

const Order = require('../models/Order')

const router = express.Router();

// Place new order
router.post('/place', async (req, res) => {
  try {
    const { userId, totalCost, cart } = req.body;

    if (!cart.length) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const newOrder = new Order({
      userId,
      totalCost,
      products: cart
    });

    await newOrder.save();

    res.status(201).json({ message: 'Order placed successfully', orderId: newOrder._id });
  } catch (error) {
     console.error('Order save error:', error);
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const orders = await Order.find({ userId }).sort({ orderTime: -1 });
    
    res.status(200).json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

module.exports = router;
