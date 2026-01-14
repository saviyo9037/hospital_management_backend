const mongoose=require('mongoose')
const User = require('./UserModel')
const doctor = require('./Doctor')
// const patientsM = require('./PatientModel')
const Patient = require('./PatientModel')

const appoimentmodel=new mongoose.Schema({
   patient  :{
        type:mongoose.Schema.Types.ObjectId,
        ref:Patient,
        required:true
    },
    doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:doctor,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
        reason: { type: String },
        status:{
            type:String,
          enum:["pending","confirmed","cancelled,completed"],
          default:"pending"
        }
},
{timestamps:true})


const Appointment=mongoose.model("Appointment",appoimentmodel)
module.exports=Appointment