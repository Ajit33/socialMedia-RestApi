const express=require("express")
const route=express.Router()
const auth=require("./auth")
const user=require("./user")
const post=require("./post")
route.use("/auth",auth)
route.use("/user",user)
route.use("/post",post)


module.exports=route; 