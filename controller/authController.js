

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const User = require("../models/userModel")


require('dotenv').config();
const authController = {
  create: async (req, res) => {
    try {
      const { name, email, password, role } = req.body

      if (!name || !email || !password) {
        return res.status(400).send("validation error creation")
      }
      if (role && role.toLowerCase() === "admin") {
        return res.status(403).json({ message: "You cannot assign yourself as admin" });
      }
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const createuser = new User({
        name,
        email,
        password: hashedPassword,
        role: role ? role.toLowerCase() : "patient",
      })
      await createuser.save();
      const paylod = {
        id: createuser._id,
        email: createuser.email,
        role: createuser.role
      }
      const token = jwt.sign(paylod, process.env.JWT_SECRET_KEY, { expiresIn: "1h" })

      res.status(201).json({
        token,
        message: "user  created successfully"
      })
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        return res.status(400).json({ message: "enter the currect email and password" })
      }
      const existingUser = await User.findOne({ email })
      if (!existingUser || !existingUser.password) {
        return res.status(404).json({ message: "User not found" });
      }
      const userFound = await bcrypt.compare(password, existingUser.password)

      if (!userFound) {
        return res.status(401).json({ message: "Invalid password" });
      }
      const paylod = {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role
      };
      const token = jwt.sign(paylod, process.env.JWT_SECRET_KEY)
      console.log(token);


      res.status(200).json({
        message: "Login successful",
        token
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });

    }

  },
  createAdmin: async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).send("Validation error: name, email, and password are required.");
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists." });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const createAdminUser = new User({
        name,
        email,
        password: hashedPassword,
        role: "admin", // Explicitly set role to admin
      });

      await createAdminUser.save();

      const payload = {
        id: createAdminUser._id,
        email: createAdminUser.email,
        role: createAdminUser.role,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

      res.status(201).json({
        token,
        message: "Admin user created successfully.",
      });
    } catch (error) {
      console.error("Error creating admin user:", error);
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  }
}

module.exports = authController;
