const express=require("express")

const route=express.Router()
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken");
const { CustomError } = require("../middlewares/error");
const User=require("../models/User")

const signupController = async (req, res, next) => {
    console.log(req.body);
    try {
      const { username, password, email } = req.body;
  
      // Check if the user already exists
      const existingUser = await User.findOne({
        $or: [
          { username: new RegExp(`^${username}$`, "i") },
          { email: new RegExp(`^${email}$`, "i") }
        ]
      });
  
      if (existingUser) {
        return next(new CustomError("Username or Email already exists!", 409));
      }
  
      // Hash the password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create and save the new user
      const newUser = new User({ ...req.body, password: hashedPassword });
      const savedUser = await newUser.save();
  
      res.status(201).json({
        message: "User created successfully!",
        data: savedUser,
      });
    } catch (error) {
      next(error);
    }
  };
  


  const signinController=async (req, res,next) => {
    try {
      let user;
      if (req.body.email) {
        user = await User.findOne({ email: req.body.email });
      } else {
        user = await User.findOne({ username: req.body.username });
      }
  
      if (!user) {
      throw new CustomError("Sorry Looks like User not found !", 404)
      }
  
      const match = bcrypt.compareSync(req.body.password, user.password);
      if (!match) {
        
          throw new  CustomError("Invalid Password",400)
        
      }
  
      const { password, ...userData } = user.toObject(); // Convert to object and destructure
      const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
      });
  
      res.cookie("token", token, { httpOnly: true,secure:true }).status(200).json({
        message: "Sign in successfully!",
        data: userData,
      });
      console.log(token)
    } catch (error) {
     next(error)
    }
  }

 const signoutController= async(req,res,next)=>{
    try {
    res.clearCookie("token",{sameSite:true ,secure:true}).status(200).json({
      message:"Logout Sucessfully !"
    })
    } catch (error) {
     next(error)
  }
  } 

  const fetchUserController= async(req,res,next)=>{
    console.log(req.cookies.token)
    const token=req.cookies.token;
  
    jwt.verify(token,process.env.SECRET_KEY,{},async(err,data)=>{
      if(err){
      throw new CustomError("Invalid Token",401)
      }
      try {
        const id=data._id;
        const user=await User.findOne({_id:id})
        res.status(200).json({
          data:user
        })
      } catch (error) {
        next(error)
      }
    })
  }


  module.exports={signinController,signoutController,signupController,fetchUserController}