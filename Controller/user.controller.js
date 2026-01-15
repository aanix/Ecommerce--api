const User = require("../Models/user.model");
const logger = require("../Helpers/logger");

module.exports = {

  // CREATE USER
  create: async (req, res) => {
    try {
      logger.info("Create User API called", req.body);

      const userData = req.body;
      const newUser = new User(userData);
      const result = await newUser.save();

      logger.info("User created successfully", result._id);

      return res.status(201).json(result);
    } catch (err) {
      logger.error("CREATE USER ERROR", err);

      return res.status(500).json({ message: err.message });
    }
  },

  // LIST USERS
  list: async (req, res) => {
    try {
      logger.info("List Users API called");

      const results = await User.find();

      if (!results.length) {
        logger.warn("No users found in database");
      }

      return res.status(200).json(results);
    } catch (err) {
      logger.error("LIST USERS ERROR", err);

      return res.status(500).json({ message: err.message });
    }
  },

  // UPDATE USER
  update: async (req, res) => {
    try {
      const userId = req.params.id;
      logger.info("Update User API called", userId);

      const userData = req.body;

      const result = await User.findByIdAndUpdate(
        userId,
        userData,
        { new: true } // return updated document
      );

      if (!result) {
        logger.warn(`User not found for update: ${userId}`);
        return res.status(404).json({ message: "User not found" });
      }

      logger.info("User updated successfully", userId);

      return res.status(200).json(result);
    } catch (err) {
      logger.error("UPDATE USER ERROR", err);

      return res.status(500).json({ message: err.message });
    }
  },

  // DELETE USER
  delete: async (req, res) => {
    try {
      const userId = req.params.id;
      logger.info("Delete User API called", userId);

      const result = await User.findByIdAndDelete(userId);

      if (!result) {
        logger.warn(`User not found for delete: ${userId}`);
        return res.status(404).json({ message: "User not found" });
      }

      logger.info("User deleted successfully", userId);

      return res.status(200).json(result);
    } catch (err) {
      logger.error("DELETE USER ERROR", err);

      return res.status(500).json({ message: err.message });
    }
  }
};
