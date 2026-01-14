const express = require('express');
const patientController = require('../controller/patientController');
const isAuth = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleAuth');

const patientRouter = express.Router();

patientRouter.post("/", isAuth, roleMiddleware("admin"), patientController.create);
patientRouter.get("/", isAuth, roleMiddleware("patient", "admin"), patientController.getAll);
patientRouter.get("/:id", isAuth, roleMiddleware("patient", "admin"), patientController.getOne);
patientRouter.delete("/:id", isAuth, roleMiddleware("admin"), patientController.delete);
patientRouter.put("/:id", isAuth, roleMiddleware("admin", "patient"), patientController.update);

module.exports = patientRouter;
