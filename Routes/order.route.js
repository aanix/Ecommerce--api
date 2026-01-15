const express = require("express");
const router = express.Router();

const { placeOrder } = require("../Controller/order.controller");
const verifyJWT = require("../Middleware/verifyJWT");

router.post("/place", verifyJWT, placeOrder);

module.exports = router;
