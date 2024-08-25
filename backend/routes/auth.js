const express = require("express");
const User = require("../models/User");
const route=express.Router()
const {
  signupController,
  signinController,
  signoutController,
  fetchUserController,
} = require("../controller/authController");

//signup

route.post("/signup", signupController);

//sign in

route.post("/signin", signinController);

//signout
route.get("/signout", signoutController);

//fetch current user

route.get("/fetchUser", fetchUserController);

module.exports = route;
