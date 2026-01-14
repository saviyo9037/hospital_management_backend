const doctor = require('../models/Doctor');
const DoctorProfile = require('../models/DoctorProfile'); // Import DoctorProfile model
const User = require('../models/userModel');
require('dotenv').config();

const doctorController = {
    createDoctor: async (req, res) => {
        try {
            const { name, email, password } = req.body; // Removed specialization, address, experience

            if (!name || !email || !password) {
                return res.status(400).json({ message: "Please enter all required fields" });
            }

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "User with this email already exists" });
            }

            const newUser = await User.create({ name, email, password, role: "doctor" });

            const newDoctor = await doctor.create({
                user: newUser._id,
            });
            console.log("New Doctor created:", newDoctor);

            // Automatically create a DoctorProfile for the new doctor
            await DoctorProfile.create({
                doctor: newDoctor._id,
                specialization: "", // Default or empty values
                address: "",
                experience: 0,
                bio: "",
                clinicAddress: "",
                officeHours: "",
                medicalLicense: "",
            });

            res.status(201).json({
                message: "Doctor created successfully",
                doctor: {
                    _id: newDoctor._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                },
            });
        } catch (error) {
            console.error("Error creating doctor:", error.message);
            res.status(500).send("Server error");
        }
    },

    getAllDoctors: async (req, res) => {
        try {
            const doctors = await doctor.find().populate("user", "name email role");
            console.log("Doctors fetched from DB:", doctors);
            res.status(200).json({ doctors });
        } catch (error) {
            console.error("Error fetching doctors:", error.message);
            res.status(500).send("Server error");
        }
    },

    getDoctorById: async (req, res) => {
        try {
            const getdoctors = await doctor.findById(req.params.id).populate({
                path: "user",
                select: "name email role"
            });

            if (!getdoctors) {
                return res.status(404).json({ message: "Doctor not found" });
            }
            res.status(200).json({ doctor: getdoctors }); // Wrap in doctor object

        } catch (error) {
            console.log(error.message);
            res.status(500).send("internal server error")
        }
    },
    updateDoctor: async (req, res) => {
        try {
            const { id } = req.params;
            const { name, email } = req.body; // Only name and email for User model

            const existingDoctor = await doctor.findById(id);
            if (!existingDoctor) {
                return res.status(404).json({ message: "Doctor not found" });
            }

            // Update associated User model
            const user = await User.findById(existingDoctor.user);
            if (!user) {
                return res.status(404).json({ message: "Associated user not found" });
            }
            user.name = name || user.name;
            user.email = email || user.email;
            await user.save();

            // No update to Doctor model itself, as profile fields are now in DoctorProfile

            const updatedDoctor = await doctor.findById(id).populate("user", "name email role");

            res.status(200).json({
                message: "Doctor updated successfully",
                doctor: updatedDoctor
            });

        } catch (error) {
            console.error(error.message);
            res.status(500).send("internal server error")
        }
    },
    deleteDoctor: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedDoctor = await doctor.findByIdAndDelete(id);

            if (!deletedDoctor) {
                return res.status(404).json({ message: "Doctor not found" });
            }

            await User.findByIdAndDelete(deletedDoctor.user);
            await DoctorProfile.findOneAndDelete({ doctor: deletedDoctor._id }); // Delete associated DoctorProfile

            res.status(200).json({ message: "Doctor and associated user deleted successfully" });
        } catch (error) {
            console.error("Error deleting doctor:", error.message);
            res.status(500).send("Internal server error");
        }
    }
}

module.exports = doctorController;
