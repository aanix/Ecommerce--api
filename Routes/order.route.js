const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder
} = require("../Controller/order.controller");

const verifyJWT = require("../Middleware/verifyJWT");

// ================= USER =================

// Place order
router.post("/place", verifyJWT, placeOrder);

// Get logged-in user's orders
router.get("/my", verifyJWT, getMyOrders);


// ================= ADMIN =================

// Get all orders
router.get("/", verifyJWT, getAllOrders);

// Update order status
router.put("/update/:id", verifyJWT, updateOrderStatus);

// Delete order
router.delete("/delete/:id", verifyJWT, deleteOrder);

module.exports = router;
