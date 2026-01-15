const User = require("../Models/user.model");
const logger = require("../Helpers/logger");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../Helpers/mailer");

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    logger.info("Register API called", email);

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`Registration failed: User already exists - ${email}`);
      return res.status(400).json({ message: "User already exists" });
    }

    // 2. Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // 4. Save user
    await user.save();
    logger.info("User registered successfully", user._id);

    // 5. Send welcome email
    try {
      await sendEmail({
        to: email,
        subject: "Welcome to Our App",
        html: "<h1>Welcome 🎉</h1><p>Your account is created.</p>",
        text: "Welcome! Your account is created.",
      });

      logger.info("Welcome email sent", email);
    } catch (mailError) {
      // Email fail should not break registration
      logger.warn("Email sending failed", mailError.message);
    }

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    logger.error("REGISTER ERROR", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    logger.info("Login API called", email);

    // 1. Check user exists
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Login failed: User not found - ${email}`);
      return res.status(400).json({ message: "User not found" });
    }

    // 2. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.warn(`Login failed: Invalid password - ${email}`);
      return res.status(400).json({ message: "Invalid password" });
    }

    // 3. Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    logger.info("User logged in successfully", user._id);

    res.status(200).json({
      message: "Login successful",
      token: token,
    });

  } catch (error) {
    logger.error("LOGIN ERROR", error);
    res.status(500).json({ message: "Server error" });
  }
};
