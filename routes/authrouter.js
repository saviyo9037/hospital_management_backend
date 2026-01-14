const express = require("express");
const authController = require("../controller/authController");

const authrouter = express.Router();

authrouter.post("/register", authController.create);
authrouter.post("/login", authController.loginUser);
authrouter.post("/admin/register", authController.createAdmin);

module.exports = authrouter;
