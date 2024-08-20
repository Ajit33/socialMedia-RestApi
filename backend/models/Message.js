const { type } = require("express/lib/response")
const mongoose=require("mongoose")



const messageSchema=new mongoose.Schema({
  ConverstionId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Converstion",
    requiered:true
  },
  sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  }
})

const Message=mongoose.model("Message",messageSchema)

module.exports=Message