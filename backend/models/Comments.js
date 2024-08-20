const mongoose=require("mongoose")

const commentSchema=new mongoose.Schema({
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        requied:true
    },
   post:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Post",
    required:true
   },
   text:{
    type:String,
    requied:true,
    trim:true
   },
   likes:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
   }],
   replies:[{
    User:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        requied:true
    },
    text:{
        type:String,
        requied:true,
        trim:true
       },
       likes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
       }],
       createdAt:{
         type:Date,
         default:Date.now 
       }
   }],
   createdAt:{
    type:Date,
    default:Date.now 
  }
})

const Comments=mongoose.model("Comments",commentSchema)

module.exports=Comments