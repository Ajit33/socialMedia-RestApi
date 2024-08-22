const express=require("express")
const User = require("../models/User")
const route=express.Router()
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
//signup

route.post("/signup", async (req, res) => { 
  console.log(req.body);
  try {
    const { username, password, email } = req.body;

    const existingUser = await User.findOne({
      $or: [
        { username: new RegExp(`^${username}$`, "i") },
        { email: new RegExp(`^${email}$`, "i") }
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists!"
      });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hashSync(password, salt);

    const newUser = new User({ ...req.body, password: hashedPassword });
    const savedUser = await newUser.save();

    res.status(201).json({
      message: "User created successfully!",
      data: savedUser
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error.message
    });
  }
});



//sign in

route.post("/signin", async (req, res) => {
  try {
    let user;
    if (req.body.email) {
      user = await User.findOne({ email: req.body.email });
    } else {
      user = await User.findOne({ username: req.body.username });
    }

    if (!user) {
      return res.status(401).json({
        message: "Invalid Username or Email",
      });
    }

    const match = bcrypt.compareSync(req.body.password, user.password);
    if (!match) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    const { password, ...userData } = user.toObject(); // Convert to object and destructure
    const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.cookie("token", token, { httpOnly: true }).status(200).json({
      message: "Sign in successfully!",
      data: userData,
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
});


//signout


//fetch current user


module.exports=route