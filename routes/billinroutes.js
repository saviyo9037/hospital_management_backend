const express=require('express')
const billingontroller = require('../controller/billingController')
const isAuth = require('../middleware/authMiddleware')

const billingRouter=express.Router()

billingRouter.post("/",isAuth,billingontroller.createBill)
billingRouter.get("/:id",isAuth,billingontroller.getbill)
module.exports=billingRouter