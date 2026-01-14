const Billings = require("../models/Bill");

const billingController = {
  createBill: async (req, res) => {
    try {
      const { patient, doctor, appointment, amount, paymentMethod, paymentStatus } = req.body;

      if (req.user.role !== "admin" && req.user.role !== "doctor") {
        return res.status(403).json({ message: "Only doctor or admin can create bill" });
      }

      const bill = new Billings({
        patient,
        Doctor: doctor,  
        appointment,
        amount,
        paymentMethod,
        paymentStatus,

      });

      await bill.save();

      res.status(201).json({ message: "Bill created successfully", bill });
    } catch (error) {
      res.status(500).json({ message: "Error creating bill", error: error.message });
    }
  },
  getbill:async (req,res) => {
    try {
        const {id}=req.params
        if(!id){
            return res.status(404).json({message:"bill not  found"})

        }

        const findbill=await Billings.findById(id)
  if (!findbill) {
      return res.status(404).json({ message: "Bill not found" })
    }
         res.status(200).json({
      message: "Bill fetched successfully",
      bill:findbill
    })
    } catch (error) {
          console.log("getBill error:", error)
        res.status(500).send("internal server error")
        
    }
    
  }
};

module.exports = billingController;
