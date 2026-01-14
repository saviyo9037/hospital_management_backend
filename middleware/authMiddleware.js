const jwt = require('jsonwebtoken')
const User = require('../models/usermodel')
require('dotenv').config()

const isAuth = async (req, res, next) => {
  try {
    // 1️⃣ Check token exists
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization token missing or invalid" })
    }

    const token = authHeader.split(" ")[1]

    

    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)

    if (!verifiedToken) {
      return res.status(401).json({ message: "Token not verified!!!" })
    }

    // 3️⃣ Find user from token payload
    const userFound = await User.findOne({ email: verifiedToken.email })
    if (!userFound) {
      return res.status(404).json({ message: "User not found" })
    }

    // 4️⃣ Attach user to request object
    req.user = userFound

    // 5️⃣ Continue to controller
    next()

  } catch (error) {
    console.log("isAuth Error", error)
    res.status(500).json({ message: "Internal Server Error", error: error.message })
  }
}

module.exports = isAuth
