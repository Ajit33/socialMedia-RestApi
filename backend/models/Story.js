const mongoose=require("mongoose")


const storySchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
   image:{
    type:String,
    required:false
   },
   text:{
    type:String,
    required:false,
    trim:true
   },
   createdAt:{
    type:Date,
    default:Date.now
   }
})



const Story=mongoose.model("Story",storySchema)
module.exports=Story