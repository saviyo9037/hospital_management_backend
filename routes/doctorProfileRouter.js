const express = require('express');
const doctorProfileController = require('../controller/doctorProfileController');
const isAuth = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleAuth');

const doctorProfileRouter = express.Router();

// Create a new doctor profile (protected route, only for doctors)
doctorProfileRouter.post('/', isAuth, roleMiddleware("doctor"), doctorProfileController.create);

// Get doctor profile (protected route, only for doctors)
doctorProfileRouter.get('/', isAuth, roleMiddleware("doctor"), doctorProfileController.getOne);

// Update doctor profile (protected route, only for doctors)
doctorProfileRouter.put('/', isAuth, roleMiddleware("doctor"), doctorProfileController.update);

// Delete doctor profile (protected route, only for doctors)
doctorProfileRouter.delete('/', isAuth, roleMiddleware("doctor"), doctorProfileController.delete);

module.exports = doctorProfileRouter;
