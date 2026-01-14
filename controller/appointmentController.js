const doctor = require("../models/doctor");
const Appointment = require("../models/Appointment");
const Patient = require("../models/PatientModel");

const appointmentController = {
  create: async (req, res) => {
    try {
      const { patient: patientId, doctor: doctorId, date, reason, status } = req.body;

      if (!patientId || !doctorId || !date || !reason) {
        return res.status(400).json({ message: "Validation error: Missing required appointment fields" });
      }

      const patient = await Patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      const doctors = await doctor.findById(doctorId);
      if (!doctors) {
        return res.status(404).json({ message: "Doctor not found" });
      }

      const newAppointment = await Appointment.create({
        patient: patientId,
        doctor: doctorId,
        date,
        reason,
        status: status || "pending",
      });

      res.status(201).json({ message: "Appointment created successfully", newappointments: newAppointment });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  },

  getAll: async (req, res) => {
    try {
      const { doctor: doctorId, patient: patientId } = req.query;
      let filter = {};

      if (doctorId) {
        const foundDoctor = await doctor.findOne({ user: doctorId });
        if (foundDoctor) {
          filter.doctor = foundDoctor._id;
        } else {
          return res.status(404).json({ message: "Doctor not found for the given user ID" });
        }
      } else if (patientId) {
        const foundPatient = await Patient.findOne({ user: patientId });
        if (foundPatient) {
          filter.patient = foundPatient._id;
        } else {
          return res.status(404).json({ message: "Patient not found for the given user ID" });
        }
      }

      const appointments = await Appointment.find(filter)
        .populate({
          path: "patient",
          populate: {
            path: "user",
            select: "name role",
          },
        })
        .populate({
          path: "doctor",
          populate: {
            path: "user",
            select: "name role",
          },
        });

      res.status(200).json({ message: "Appointments fetched successfully", appointments });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  },

  getOne: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).send("Validation error: Appointment ID is required");
      }
      const findAppointment = await Appointment.findById(id)
        .populate({
          path: "patient",
          populate: {
            path: "user",
            select: "name role",
          },
        })
        .populate({
          path: "doctor",
          populate: {
            path: "user",
            select: "name role",
          },
        });

      if (!findAppointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      res.status(200).json({ message: "Appointment fetched successfully", appointment: findAppointment });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedAppointment = await Appointment.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
        .populate({
          path: "patient",
          populate: {
            path: "user",
            select: "name role",
          },
        })
        .populate({
          path: "doctor",
          populate: {
            path: "user",
            select: "name role",
          },
        });

      if (!updatedAppointment) {
        return res.status(404).json({
          message: "Appointment not found or not updated",
        });
      }
      res.status(200).json({
        message: "Appointment updated successfully",
        appointment: updatedAppointment,
      });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedAppointment = await Appointment.findByIdAndDelete(id);
      if (!deletedAppointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      res.status(200).send("Appointment successfully deleted");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  },
};

module.exports = appointmentController;
