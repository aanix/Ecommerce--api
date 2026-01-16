const Product = require("../Models/product.model");
const logger = require("../Helpers/logger");

// CREATE PRODUCT (Admin)
exports.createProduct = async (req, res) => {
  try {
    logger.info("Create Product API called", req.body);

    const product = await Product.create(req.body);

    logger.info("Product created successfully", product._id);

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    logger.error("Error while creating product", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ================= UPDATE PRODUCT (ADMIN) =================
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    logger.info("Update Product API called", productId);

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      logger.warn(`Product not found for update: ${productId}`);
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });

  } catch (error) {
    logger.error("Error while updating product", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE PRODUCT (ADMIN) =================
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    logger.info("Delete Product API called", productId);

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      logger.warn(`Product not found for delete: ${productId}`);
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    logger.error("Error while deleting product", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL PRODUCTS (User)
exports.getAllProducts = async (req, res) => {
  try {
    logger.info("Get All Products API called");

    const products = await Product.find({ isActive: true });

    if (!products.length) {
      logger.warn("No active products found");
    }

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    logger.error("Error while fetching all products", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE PRODUCT
exports.getProductById = async (req, res) => {
  try {
    logger.info("Get Product By ID API called", req.params.id);

    const product = await Product.findById(req.params.id);

    if (!product) {
      logger.warn(`Product not found with id: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    logger.error(
      `Error while fetching product with id: ${req.params.id}`,
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
