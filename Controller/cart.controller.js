const Cart = require("../Models/cart.model");
const Product = require("../Models/product.model");
const logger = require("../Helpers/logger");

// ================= ADD TO CART =================
exports.addToCart = async (req, res) => {
  try {
    // 🔹 Step 1: User ID (JWT se aa rahi hai)
    const userId = req.user.userId;

    // 🔹 Step 2: Frontend se data
    const { productId, quantity } = req.body;

    logger.info("Add to Cart API called", {
      userId,
      productId,
      quantity,
    });

    // 🔹 Step 3: Product exist karta hai ya nahi
    const product = await Product.findById(productId);
    if (!product) {
      logger.warn(`Add to cart failed: Product not found - ${productId}`);
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔹 Step 4: User ka cart find karo
    let cart = await Cart.findOne({ user: userId });

    // 🔹 Step 5: Agar cart nahi mila (first time user)
    if (!cart) {
      logger.info("Cart not found, creating new cart", userId);

      cart = new Cart({
        user: userId,
        items: [
          {
            product: productId,
            quantity: quantity || 1,
          },
        ],
      });
    } else {
      // 🔹 Step 6: Cart already exist karta hai
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity || 1;
        logger.info("Product quantity updated in cart", productId);
      } else {
        cart.items.push({
          product: productId,
          quantity: quantity || 1,
        });
        logger.info("New product added to cart", productId);
      }
    }

    // 🔹 Step 7: Cart save karo
    await cart.save();
    logger.info("Cart saved successfully", cart._id);

    res.status(200).json({
      message: "Product added to cart",
      cart,
    });
  } catch (error) {
    logger.error("ADD TO CART ERROR", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= GET USER CART =================
exports.getMyCart = async (req, res) => {
  try {
    // 🔹 Step 1: User ID JWT se
    const userId = req.user.userId;

    logger.info("Get My Cart API called", { userId });

    // 🔹 Step 2: User ka cart find karo
    const cart = await Cart.findOne({ user: userId })
      .populate("items.product");

    // 🔹 Step 3: Cart empty ya not found
    if (!cart || cart.items.length === 0) {
      logger.warn("Cart is empty", userId);
      return res.status(200).json({
        message: "Cart is empty",
        cart: null,
      });
    }

    // 🔹 Step 4: Cart return karo
    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    logger.error("GET CART ERROR", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({
      message: "Cart updated successfully",
      cart
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    res.status(200).json({
      message: "Product removed from cart",
      cart
    });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

