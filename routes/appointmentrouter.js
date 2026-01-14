const express = require("express");
const appointmentController = require("../controller/appointmentController");
const isAuth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleAuth");

const appointmentroute = express.Router();

appointmentroute.post(
  "/",
  isAuth,
  roleMiddleware("admin", "patient", "doctor"),
  appointmentController.create
);
appointmentroute.get(
  "/",
  isAuth,
  roleMiddleware("admin", "patient", "doctor"),
  appointmentController.getAll
);
appointmentroute.get(
  "/:id",
  isAuth,
  roleMiddleware("admin", "patient", "doctor"),
  appointmentController.getOne
);

appointmentroute.put(
  "/:id",
  isAuth,
  roleMiddleware("admin", "patient", "doctor"),
  appointmentController.update
);
appointmentroute.delete(
  "/:id",
  isAuth,
  roleMiddleware("admin", "patient", "doctor"),
  appointmentController.delete
);

module.exports = appointmentroute;