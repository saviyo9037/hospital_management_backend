const mongoose = require('mongoose');

const patientProfileSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    maxlength: 1000,
  },
  medicalHistory: {
    type: String,
  },
  allergies: {
    type: String,
  },
  emergencyContact: {
    name: { type: String },
    phone: { type: String },
  },
}, { timestamps: true });

const PatientProfile = mongoose.model('PatientProfile', patientProfileSchema);
module.exports = PatientProfile;
