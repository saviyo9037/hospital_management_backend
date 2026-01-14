const Patient = require("../models/PatientModel");
const User = require("../models/usermodel"); // Assuming User model is needed for population

const patientController = {
  create: async (req, res) => {
    try {
      const { userId, age, gender, Number } = req.body;

      if (!userId || !age || !gender || !Number) {
        return res.status(400).json({ message: "Validation error: Missing required patient fields" });
      }

      const userExists = await User.findById(userId);
      if (!userExists) {
        return res.status(404).json({ message: "User not found" });
      }

      const newPatient = new Patient({
        user: userId,
        age,
        gender,
        Number,
      });
      await newPatient.save();

      // Automatically create a PatientProfile for the new patient
      const PatientProfile = require("../models/PatientProfile");
      await PatientProfile.create({
        patient: newPatient._id,
        bio: "",
        medicalHistory: "",
        allergies: "",
        emergencyContact: {
          name: "",
          phone: "",
        },
      });

      res.status(201).json({ message: "Patient created successfully", patient: newPatient });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  },

  getAll: async (req, res) => {
    try {
      const fetch = await Patient.find().populate("user", "name email role");
      res.status(200).json({ message: "Patients fetched successfully", fetch });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  },

  getOne: async (req, res) => {
    try {
      const { id } = req.params; // Use 'id' as passed from frontend
      if (!id) {
        return res.status(400).send("Validation error: Patient ID is required");
      }
      const patientfound = await Patient.findById(id).populate("user", "name email role");

      if (!patientfound) {
        return res.status(404).json({ message: "Patient not found" });
      }

      res.status(200).json({ message: "Patient fetched successfully", patientfound });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedPatient = await Patient.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate("user", "name email role");

      if (!updatedPatient) {
        return res.status(404).json({ message: "Patient not found or not updated" });
      }

      res.status(200).json({ message: "Patient updated successfully", patient: updatedPatient });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deletepatient = await Patient.findByIdAndDelete(id);

      if (!deletepatient) {
        return res.status(404).json({ message: "Patient not found" });
      }

      res.status(200).send("Patient successfully deleted");
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  },
};

module.exports = patientController;
