const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const logger = require("./Helpers/logger");

const app = express();
app.use(cors());
app.use(bodyParser.json());


// auth route
const authRoute = require("./Routes/auth.route");
const userRoute = require("./Routes/user.route");
const productRoute = require("./Routes/product.route");
const cartRoute = require("./Routes/cart.route");
const orderRoute = require("./Routes/order.route");

// Routes
 app.use("/auth", authRoute);
 app.use("/user", userRoute);
 app.use("/product", productRoute);
 app.use("/cart", cartRoute);
 app.use("/order", orderRoute);



// MongoDB connection
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_Name,
  })
  .then(() => {
    logger.info(`MongoDB connected to ${process.env.DB_Name}`);
  })
  .catch((err) => logger.error(err.message));

// Server start
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
