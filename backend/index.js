import { configDotenv } from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport, { setupPassport } from "./config/passport.js";

import authRoutes from "./routes/auth.routes.js";
// OTP routes are already included in auth.routes.js, no need to import separately
import headerRoutes from "./routes/header.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import addressRoutes from "./routes/address.routes.js";
import ordersRoutes from "./routes/orders.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";

import connectDB from "./config/DataBaseConnection.js";
import cookieJwtAuth from "./middleware/authMiddleware.js";

configDotenv();

console.log(
  "Razorpay env loaded:",
  Boolean(process.env.RAZORPAY_KEY_ID),
  Boolean(process.env.RAZORPAY_KEY_SECRET)
);
const server = express();
server.set("trust proxy", 1);
server.use(
  cors({
    origin: [
      "https://www.tickntrack.in",
      "https://tickntrack.in",
      "http://localhost:5173", // dev
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
server.options("*", cors());
setupPassport(passport);
server.use(passport.initialize());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.get("/api/health", (req, res) => res.json({ ok: true }));

// Current user route (cookie + JWT)
server.get("/api/me", cookieJwtAuth, (req, res) => {
  res.json({ user: req.user });
});
// Routes
server.use("/api/auth", authRoutes);
// OTP routes are already included in auth.routes.js
server.use("/api/header", headerRoutes);
server.use("/api/products", productRoutes);
server.use("/api/cart", cartRoutes);
server.use("/api/payment", paymentRoutes);
server.use("/api/address", addressRoutes);
server.use("/api/orders", ordersRoutes);
server.use("/api/admin", adminRoutes);
server.use("/api/wishlist", wishlistRoutes);

// Log registered routes for debugging
console.log("Payment routes registered at /api/payment");
console.log("COD endpoint available at POST /api/payment/cod");

const PORT = process.env.PORT || 5000;
// Connect DB
await connectDB(process.env.MONGODB_URI || "");

// Start server
server.listen(PORT, () => {
  console.log("Server is running at", PORT);
});
