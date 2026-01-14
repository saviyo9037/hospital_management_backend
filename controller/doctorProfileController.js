const DoctorProfile = require("../models/DoctorProfile");
const Doctor = require("../models/Doctor");

const doctorProfileController = {
  create: async (req, res) => {
    try {
      const { bio, clinicAddress, officeHours, medicalLicense, specialization, address, experience } = req.body;
      const userId = req.ser.id; // Assuming user ID is available from authentication middleware

      const doctor = await Doctor.findOne({ user: userId });
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found for this user" });
      }

      const existingDoctorProfile = await DoctorProfile.findOne({ doctor: doctor._id });
      if (existingDoctorProfile) {
        return res.status(400).json({ message: "Doctor profile already exists for this doctor" });
      }

      const newDoctorProfile = new DoctorProfile({
        doctor: doctor._id,
        bio,
        clinicAddress,
        officeHours,
        medicalLicense,
        specialization,
        address,
        experience,
      });

      await newDoctorProfile.save();
      res.status(201).json({ message: "Doctor profile created successfully", doctorProfile: newDoctorProfile });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  },

  getOne: async (req, res) => {
    try {
      const userId = req.user.id; // Assuming user ID is available from authentication middleware

      let doctor = await Doctor.findOne({ user: userId });
      if (!doctor) {
        // If Doctor entry doesn't exist, create one automatically
        doctor = await Doctor.create({ user: userId });
        console.log(`Auto-created Doctor entry for user: ${userId}`);
      }

      let doctorProfile = await DoctorProfile.findOne({ doctor: doctor._id }).populate({
        path: 'doctor',
        populate: {
          path: 'user',
          select: 'name email role'
        }
      });

      if (!doctorProfile) {
        // If DoctorProfile entry doesn't exist, create one automatically with default values
        doctorProfile = await DoctorProfile.create({
          doctor: doctor._id,
          bio: "",
          clinicAddress: "",
          officeHours: "",
          medicalLicense: "",
          specialization: "General Practitioner", // Provide a default value
          address: "",
          experience: 0,
        });
        console.log(`Auto-created DoctorProfile entry for doctor: ${doctor._id}`);
      }

      res.status(200).json({ message: "Doctor profile fetched successfully", doctorProfile });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  },

  update: async (req, res) => {
    try {
      const { bio, clinicAddress, officeHours, medicalLicense, specialization, address, experience } = req.body;
      const userId = req.user.id; // Assuming user ID is available from authentication middleware

      const doctor = await Doctor.findOne({ user: userId });
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found for this user" });
      }

      const doctorProfile = await DoctorProfile.findOne({ doctor: doctor._id });

      if (!doctorProfile) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }

      doctorProfile.bio = bio || doctorProfile.bio;
      doctorProfile.clinicAddress = clinicAddress || doctorProfile.clinicAddress;
      doctorProfile.officeHours = officeHours || doctorProfile.officeHours;
      doctorProfile.medicalLicense = medicalLicense || doctorProfile.medicalLicense;
      doctorProfile.specialization = specialization || doctorProfile.specialization;
      doctorProfile.address = address || doctorProfile.address;
      doctorProfile.experience = experience || doctorProfile.experience;

      await doctorProfile.save();
      res.status(200).json({ message: "Doctor profile updated successfully", doctorProfile });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  },

  delete: async (req, res) => {
    try {
      const userId = req.user.id; // Assuming user ID is available from authentication middleware

      const doctor = await Doctor.findOne({ user: userId });
      if (!doctor) {
        return res.status(404).json({ message: "Doctor not found for this user" });
      }

      const doctorProfile = await DoctorProfile.findOneAndDelete({ doctor: doctor._id });

      if (!doctorProfile) {
        return res.status(404).json({ message: "Doctor profile not found" });
      }

      res.status(200).json({ message: "Doctor profile deleted successfully" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  },
};

module.exports = doctorProfileController;