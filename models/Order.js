const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderTime: {
    type: Date,
    default: Date.now
  },
  totalCost: {
    type: Number,
    required: true
  },
  products: [
    {
      productId:Number,
      quantity: Number,
      deliveryOptionId:String,
    }
  ]
});

module.exports = mongoose.model('Order', orderSchema);
