const express = require("express");
const userController = require("../Controller/user.controller");

const router = express.Router();

router.get("/", userController.list);
router.post("/", userController.create);
router.put("/:id", userController.update);
router.delete("/:id", userController.delete);

module.exports = router;
