const express=require("express")
const route=express.Router()
const auth=require("./auth")
const user=require("./user")
route.use("/auth",auth)
route.use("/user",user)



module.exports=route; 