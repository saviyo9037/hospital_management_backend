const mongoose=require("mongoose")
const billingSchema=new mongoose.Schema({
    patient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Patient",
        required:true
    },
    Doctor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"doctor",
        required:true
    },
    appointment:{
     type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment",
    required: true
    },
     amount: {
    type: Number,
    required: true,
    min: [0, "Amount cannot be negative"]
  },
    paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },
  paymentMethod: {
    type: String,
    enum: ["cash", "credit_card", "debit_card", "upi", "insurance"],
    default: "cash"
  },
  invoiceNumber: {
    type: String,
    unique: true
  },
  issuedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const Billings = mongoose.model("Billings", billingSchema);
module.exports=Billings