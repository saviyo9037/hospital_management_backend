const mongoose=require('mongoose');
const User = require('./UserModel');
// const doctor = require('./Doctor');

const patientmodel=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    gender:{
        type:String,
        enum:["Male","Female","others"],
        default:"others"
    },
phoneNumber:{
    type:String,
        minlength: [10, "Phone number must be at least 10 digits"],
        maxlength: [15, "Phone number must not exceed 15 digits"]
}
})
const Patient=mongoose.model("Patient",patientmodel)
module.exports=Patient