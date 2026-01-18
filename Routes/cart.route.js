const express = require("express");
const router = express.Router();

const {
  addToCart,
  getMyCart,
  updateCartItem,
  removeFromCart
} = require("../Controller/cart.controller");

const verifyJWT = require("../Middleware/verifyJWT");

// ADD
router.post("/add", verifyJWT, addToCart);

// GET
router.get("/", verifyJWT, getMyCart);

// UPDATE quantity
router.put("/update", verifyJWT, updateCartItem);

// DELETE item
router.delete("/remove", verifyJWT, removeFromCart);

module.exports = router;
