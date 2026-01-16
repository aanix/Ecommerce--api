const express = require("express");
const router = express.Router();

const {
  createProduct, //from admin side only
  updateProduct,
  deleteProduct,
  //user
  getAllProducts,
  getProductById,
} = require("../Controller/product.controller");

const verifyJWT = require("../Middleware/verifyJWT");

// ADMIN
router.post("/create", verifyJWT, createProduct);

// UPDATE PRODUCT
router.put("/update/:id", verifyJWT, updateProduct);

// DELETE PRODUCT
router.delete("/delete/:id", verifyJWT, deleteProduct);


// USER
router.get("/", getAllProducts);
router.get("/:id", getProductById);

module.exports = router;
