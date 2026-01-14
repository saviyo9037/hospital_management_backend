const express=require('express')
const doctorController = require('../controller/doctorController')
const isAuth = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleAuth')

const doctorRouter=express.Router()

doctorRouter.post("/", isAuth, roleMiddleware("admin"), doctorController.createDoctor)
doctorRouter.get("/", isAuth, doctorController.getAllDoctors);
// doctorRouter.get("/",doctorController.getall)
doctorRouter.get("/:id", isAuth, roleMiddleware("doctor"), doctorController.getDoctorById);

doctorRouter.put("/:id",isAuth, roleMiddleware("doctor","admin")     ,doctorController.updateDoctor)
doctorRouter.delete("/:id", isAuth, roleMiddleware("admin"), doctorController.deleteDoctor)


module.exports=doctorRouter