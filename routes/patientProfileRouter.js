const express = require('express');
const patientProfileController = require('../controller/patientProfileController');
const isAuth = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleAuth');

const patientProfileRouter = express.Router();

// Create a new patient profile (protected route, only for patients)
patientProfileRouter.post('/', isAuth, roleMiddleware("patient"), patientProfileController.create);

// Get patient profile (protected route, only for patients)
patientProfileRouter.get('/', isAuth, roleMiddleware("patient"), patientProfileController.getOne);

// Update patient profile (protected route, only for patients)
patientProfileRouter.put('/', isAuth, roleMiddleware("patient"), patientProfileController.update);

// Delete patient profile (protected route, only for patients)
patientProfileRouter.delete('/', isAuth, roleMiddleware("patient"), patientProfileController.delete);

module.exports = patientProfileRouter;
