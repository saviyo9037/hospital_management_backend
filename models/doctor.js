// const mongoose=require('mongoose');
// const Doctormodel=new mongoose.Schema({
//     user:{
//      type:mongoose.Schema.Types.ObjectId,
//      ref:"User",
//      required:true
//     },
// })

// const doctor=mongoose.model('doctor',Doctormodel);
// module.exports=doctor


const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

const Doctor =
  mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
