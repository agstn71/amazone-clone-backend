const express = require("express");
const app = express();
const mongoose = require('mongoose');
const cors = require("cors");
const User = require("./models/User");
const bcrypt = require("bcryptjs");

require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const protectedRoutes = require('./routes/protectedRoutes');

const adminRoutes = require("./routes/adminRoutes");
const cartRoutes = require("./routes/cartRoutes")
const orderRoutes = require('./routes/orderRoutes');


app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/api", adminRoutes);
app.use('/api/cart',cartRoutes)
app.use('/api/orders', orderRoutes);


// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    createDefaultAdmin();
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

  const createDefaultAdmin = async () => {
  const existingAdmin = await User.findOne({ email: "admin@example.com" });

  if (!existingAdmin) {
    // const hashedPassword = await bcrypt.hash("123456", 10);

    const adminUser = new User({
      name: "Admin",
      email: "admin@example.com",
      password: "123e4y",
      role: "admin",
      isAdmin: true,
    });

    await adminUser.save();
    console.log("✅ Default admin user created (email: admin@example.com,");
  } else {
    console.log("✅ Admin user already exists.");
  }
};

