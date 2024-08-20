const { type } = require("express/lib/response")
const mongoose=require("mongoose")


const converstionSchema=new mongoose.Schema({
 participants:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
 }]
},{timestamps:true})


const Converstion=mongoose.model("Converstion",converstionSchema)

module.exports=Converstion