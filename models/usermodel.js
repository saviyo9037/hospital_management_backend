const mongoose = require('mongoose');

const userModel=new mongoose.Schema({
    name :{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
              unique: true,
    },
    password:{
        type:String,
        required:true,
             minlength: [6, "Password must be at least 6 characters"]
    },
    role:{
        type:String,
        enum:['admin','patient','doctor'],
        default:"patient"
    },

})


const User = mongoose.models.User || mongoose.model('User', userModel);
module.exports = User;