const mongoose=require('mongoose')
require("dotenv").config()


const run=async () => {
    await mongoose.connect(process.env.URI)
    console.log("DB connected successfully");
    
    
}

module.exports=run