const { type } = require("express/lib/response");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
  },
  bio: {
    type: String,
    trim: true,
  },
  profilepicture: {
    type: String,
    default: "",
  },
  coverpicture: {
    type: String,
    default: "",
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
  followers:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }],
  followings:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }],
  blockList:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }]
},{timestamps:true});


const User=mongoose.model("User",userSchema)
module.exports=User