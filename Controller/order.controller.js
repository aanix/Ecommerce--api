const Order = require("../Models/order.model");
const Cart = require("../Models/cart.model");
const logger = require("../Helpers/logger");

exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { address } = req.body;

    logger.info("Place Order API called", { userId });

    // 1️⃣ Find user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    console.log(cart.items[0].product);

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // 2️⃣ Prepare order items & total
    let totalAmount = 0;


    // Map cart items to order items and calculate total amount
    const orderItems = cart.items.map((item) => {
      // Add the price of each item (price * quantity) to the total amount
      totalAmount += item.product.price * item.quantity;

      // Return an object representing the order item
      return {
      product: item.product._id,    // Reference to the product ID
      quantity: item.quantity,      // Quantity ordered
      price: item.product.price,    // Price per unit at the time of order
      };
    });

    // 3️⃣ Create order
    const order = await Order.create({
      user: userId,
      items: orderItems,
      totalAmount,
      address,
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
