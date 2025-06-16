const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
    userId:{
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
    },
    items: [
        {
          productId:{
            type:Number,
            required:true,
          },
          quantity:{
            type:Number,
            required:true,
          },
          deleveryOptionId:{
            type:String,
            default:'1'
          }
        }
    ]
});

module.exports = mongoose.model("Cart",cartSchema)