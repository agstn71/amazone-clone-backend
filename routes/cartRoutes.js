const express = require("express");
const router = express.Router();
const Cart = require("../models/Cart");

// add item to cart
router.post("/add", async (req, res) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });
    if (cart) {
      const itemIndex = cart.items.findIndex(
        (item) => item.productId === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
      await cart.save();
    } else {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            quantity,
          },
        ],
      });
      await cart.save();
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//sync
router.post("/sync", async (req, res) => {
  const { userId, items } = req.body;
  try {
  let cart = await Cart.findOne({ userId });

  if (cart) {
    items.forEach((item) => {
      const itemIndex = cart.items.findIndex((dbItem) => {
        return dbItem.productId === item.productId;
      });

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += item.quantity;
      } else {
        cart.items.push({
          productId: item.productId,
          quantity: item.quantity,
        });
      }
    });
    await cart.save()
    res.status(200).json({message:"successfully added"})
    return;
  } else {
      cart = new Cart({
      userId,
      items: items.map((cartItem) => {
        return { productId: cartItem.productId, quantity: cartItem.quantity };
      }),
    });

   await cart.save()
   res.status(200).json({message:"successfully added"})
   return;
  }
}catch(err) {
    res.status(500).json({message:err.message})
}
});
// get user cart
router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  try {
    let cart = await Cart.findOne({ userId });
    if(!cart) {
        cart = {userId,items:[]}
    }
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//update cart 

router.patch('/update',async (req,res) => {
    const {userId,productId,quantity} = req.body;
    try {
   const cart = await Cart.findOne({userId});
    const itemIndex =  cart.items.findIndex((item) => item.productId === productId);
    if(itemIndex > -1){
        cart.items[itemIndex].quantity = quantity;
        await cart.save()
        res.status(200).json({message:"cart updated successfully"})
    }else {
        res.status(500).json({message:"invalid product id"})
    }

    }catch(err) {
       res.status(500).json({message:err.message})
    }

})

router.delete("/delete",async (req,res) => {
    const {userId,productId} = req.body
   

    try {
      const result = await Cart.updateOne({userId},
        {$pull:{items:{productId:productId}}}
      );
      res.status(200).json({message:"item removed from cart"})
    }catch(error) {
        res.status(500).json({message:error.message})
    }
});

router.delete('/clear/:userId',async (req,res) => {
    try {
        const userId = req.params.userId;

        await Cart.updateOne({userId},{$set:{items:[]}});
        res.status(200).json({message:"cart cleared successfully"})
    } catch(erro) {
        res.status(500).json({message:'failed to clear car'})
    }
})
module.exports = router;
