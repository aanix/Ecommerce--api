const express = require("express");
const router = express.Router();

const { addToCart, getMyCart  } = require("../Controller/cart.controller");
const verifyJWT = require("../Middleware/verifyJWT");

// ADD TO CART
router.post("/add", verifyJWT, addToCart);

// GET USER CART
router.get("/", verifyJWT, getMyCart);

module.exports = router;
