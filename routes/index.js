// routes/index.js
const express = require("express");
const authrouter = require("./authrouter");
const doctorRouter = require("./doctorRouter");
const patientRouter = require("./patientRouter");
const appointmentroute = require("./appointmentrouter");
const billingRouter = require("./billinroutes");
const doctorProfileRouter = require("./doctorProfileRouter");
const patientProfileRouter = require("./patientProfileRouter");

const router = express.Router(); // ✅ Correct

router.use("/auth", authrouter);
router.use("/doctor", doctorRouter);
router.use("/patient", patientRouter);
router.use("/appointment", appointmentroute);
router.use("/billing", billingRouter);
router.use("/doctor-profile", doctorProfileRouter);
router.use("/patient-profile", patientProfileRouter);

module.exports = router;
