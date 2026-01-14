const PatientProfile = require("../models/PatientProfile");
const Patient = require("../models/PatientModel");
const User = require("../models/userModel");

const patientProfileController = {
  create: async (req, res) => {
    try {
      const { bio, medicalHistory, allergies, emergencyContact } = req.body;
      const userId = req.user.id; // Assuming user ID is available from authentication middleware

      const patient = await Patient.findOne({ user: userId });
      if (!patient) {
        return res.status(404).json({ message: "Patient not found for this user" });
      }

      const existingPatientProfile = await PatientProfile.findOne({ patient: patient._id });
      if (existingPatientProfile) {
        return res.status(400).json({ message: "Patient profile already exists for this patient" });
      }

      const newPatientProfile = new PatientProfile({
        patient: patient._id,
        bio,
        medicalHistory,
        allergies,
        emergencyContact,
      });

      await newPatientProfile.save();
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  },

  getOne: async (req, res) => {
    try {
      const userId = req.user.id; // Assuming user ID is available from authentication middleware

      let patient = await Patient.findOne({ user: userId });
      if (!patient) {
        // If Patient entry doesn't exist, create one automatically
        patient = await Patient.create({
          user: userId,
          age: 0, // Provide a default value for required age
          gender: "others", // Provide a default value for gender enum
          phoneNumber: "0000000000" // Provide a default value that meets minlength
        });
        console.log(`Auto-created Patient entry for user: ${userId}`);
      }

      let patientProfile = await PatientProfile.findOne({ patient: patient._id }).populate({
        path: 'patient',
        populate: {
          path: 'user',
          select: 'name email role'
        }
      });

      if (!patientProfile) {
        // If PatientProfile entry doesn't exist, create one automatically with default values
        patientProfile = await PatientProfile.create({
          patient: patient._id,
          bio: "",
          medicalHistory: "",
          allergies: "",
          emergencyContact: {
            name: "",
            phone: "",
          },
        });
        console.log(`Auto-created PatientProfile entry for patient: ${patient._id}`);
      }

      res.status(200).json({ message: "Patient profile fetched successfully", patientProfile });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  },

  update: async (req, res) => {
    try {
      const { bio, medicalHistory, allergies, emergencyContact } = req.body;
      const userId = req.user.id; // Assuming user ID is available from authentication middleware

      const patient = await Patient.findOne({ user: userId });
      if (!patient) {
        return res.status(404).json({ message: "Patient not found for this user" });
      }

      const patientProfile = await PatientProfile.findOne({ patient: patient._id });

      if (!patientProfile) {
        return res.status(404).json({ message: "Patient profile not found" });
      }

      patientProfile.bio = bio || patientProfile.bio;
      patientProfile.medicalHistory = medicalHistory || patientProfile.medicalHistory;
      patientProfile.allergies = allergies || patientProfile.allergies;
      patientProfile.emergencyContact = emergencyContact || patientProfile.emergencyContact;

      await patientProfile.save();
      res.status(200).json({ message: "Patient profile updated successfully", patientProfile });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  },

  delete: async (req, res) => {
    try {
      const userId = req.user.id; // Assuming user ID is available from authentication middleware

      const patient = await Patient.findOne({ user: userId });
      if (!patient) {
        return res.status(404).json({ message: "Patient not found for this user" });
      }

      const patientProfile = await PatientProfile.findOneAndDelete({ patient: patient._id });

      if (!patientProfile) {
        return res.status(404).json({ message: "Patient profile not found" });
      }

      res.status(200).json({ message: "Patient profile deleted successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  },
};

module.exports = patientProfileController;
