const Order = require("../Models/order.model");
const Cart = require("../Models/cart.model");
const logger = require("../Helpers/logger");

/* =========================
   PLACE ORDER (USER)
========================= */
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { address } = req.body;

    logger.info("Place Order API called", { userId });

    // 1️⃣ Find user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2️⃣ Prepare order items & total
    let totalAmount = 0;

    const orderItems = cart.items.map((item) => {
      totalAmount += item.product.price * item.quantity;

      return {
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      };
    });

    // 3️⃣ Create order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      address,
      status: "pending", // default
    });

    // 4️⃣ Clear cart after order
    cart.items = [];
    await cart.save();

    logger.info("Order placed successfully", order._id);

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });

  } catch (error) {
    logger.error("PLACE ORDER ERROR", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET MY ORDERS (USER)
========================= */
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    logger.info("Get My Orders API called", userId);

    const orders = await Order.find({ user: userId })
      .populate("items.product");

    res.status(200).json({
      success: true,
      data: orders,
    });

  } catch (error) {
    logger.error("GET MY ORDERS ERROR", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   GET ALL ORDERS (ADMIN)
========================= */
exports.getAllOrders = async (req, res) => {
  try {
    logger.info("Get All Orders API called");

    const orders = await Order.find()
      .populate("user")
      .populate("items.product");

    res.status(200).json({
      success: true,
      data: orders,
    });

  } catch (error) {
    logger.error("GET ALL ORDERS ERROR", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   UPDATE ORDER STATUS (ADMIN)
========================= */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    logger.info("Update Order Status API called", {
      orderId: req.params.id,
      status,
    });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order status updated",
      order,
    });

  } catch (error) {
    logger.error("UPDATE ORDER STATUS ERROR", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   DELETE ORDER (ADMIN)
========================= */
exports.deleteOrder = async (req, res) => {
  try {
    logger.info("Delete Order API called", req.params.id);

    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order deleted successfully",
    });

  } catch (error) {
    logger.error("DELETE ORDER ERROR", error);
    res.status(500).json({ message: "Server error" });
  }
};
