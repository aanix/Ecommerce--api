const express = require("express");
const router = express.Router();

const {
  createProduct, //from admin side only
  getAllProducts,
  getProductById,
} = require("../Controller/product.controller");

const verifyJWT = require("../Middleware/verifyJWT");

// ADMIN
router.post("/create", verifyJWT, createProduct);

// USER
router.get("/", getAllProducts);
router.get("/:id", getProductById);

module.exports = router;
