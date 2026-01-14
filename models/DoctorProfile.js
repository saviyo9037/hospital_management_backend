const mongoose = require('mongoose');

const doctorProfileSchema = new mongoose.Schema({
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'doctor',
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    maxlength: 1000,
  },
  clinicAddress: {
    type: String,
  },
  officeHours: {
    type: String,
  },
  medicalLicense: {
    type: String,
  },
  specialization: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  experience: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const DoctorProfile = mongoose.model('DoctorProfile', doctorProfileSchema);
module.exports = DoctorProfile;