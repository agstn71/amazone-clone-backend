const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Cart = require("../models/Cart")
const Order = require("../models/Order")
const verifyToken = require("../middleware/verifyToken"); // your JWT middleware

// Admin-only middleware
// const isAdmin = (req, res, next) => {
//   if (!req.user || !req.user.isAdmin) {
//     return res.status(403).json({ message: "Access denied. Admins only." });
//   }
//   next();
// };

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};


// GET all users - only for admin
router.get("/admin/users", verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err });
  }
});

// delete user
router.delete('/admin/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    await Cart.deleteMany({ userId });

    // Delete Orders
    await Order.deleteMany({ userId });

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
});


module.exports = router;
