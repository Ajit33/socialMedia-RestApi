const express=require("express")
const User=require("../models/User");
const { CustomError } = require("../middlewares/error");

const getUserController=async(req,res,next)=>{
  const {userId}=req.params;
  try {
     const user=await User.findById(userId)
     if(!user){
        throw new CustomError("User Not Found",404)
     }
     const {password,...data}=user._doc
     res.status(200).json({
        data:data
     })
  } catch (error) {
    next(error)
  }
}

const updateUserController=async(req,res,next)=>{
    const {userId}=req.params
    const updateData=req.body
    try {
        const userToUpdate= await User.findById(userId)
        if(!userToUpdate){
            throw new  CustomError("User not found!",404)
        }
        Object.assign(userToUpdate,updateData)
       const updatedUser= await userToUpdate.save()
        res.status(200).json({
            message:"User Updated Sucessfully !",
            data:updatedUser
        })
    } catch (error) {
        next(error)
    }  
}

const followUserController=async(req,res,next)=>{
    const{userId}=req.params
    const{_id}=req.body
  try {
    if(userId=== _id){
        throw new CustomError(" sorry:), You can't follow yourself !",409)
    }
    const userToBeFollowed=await User.findById(userId)
    const userGoingToFollow=await User.findById(_id)
    if(!userToBeFollowed || !userGoingToFollow){
        throw new CustomError("sorry:),can't find the User !",404)
    }
    console.log(userGoingToFollow.followings)
    if(userToBeFollowed.followings.includes(_id)){
        throw new CustomError("You already following this user !",409)
    }
    userGoingToFollow.followings.push(userId)
    userToBeFollowed.followers.push(_id)
    await userGoingToFollow.save()
    await userToBeFollowed.save()
    res.status(200).json({
        message:"User followed sucessfully !",
    })
  } catch (error) {
    next(error)
  }
}

const unfollowUserController=async(req,res,next)=>{
    const {userId}=req.params;
    const {_id}=req.body;
    try {
        if(userId === _id){
         throw new CustomError("sorry:), You can't unfollow yourself !",409)
        } 
        const userToBeUnfollowed=await User.findById(userId)
        const userGoingToUnfollow=await User.findById(_id)
        if(!userToBeUnfollowed || !userGoingToUnfollow){
            throw new CustomError("Can't find the User !",404)
        }
        if(!userGoingToUnfollow.followings.includes(userId)){
            throw new CustomError("This user not followed by you ",404)
        }
        userToBeUnfollowed.followers.pull(_id)
        userGoingToUnfollow.followings.pull(userId)
        await userToBeUnfollowed.save()
        await userGoingToUnfollow.save()
        res.status(200).json({message:"User unfollowed suceesfully"})
    } catch (error) {
        next(error)
    }
}

module.exports={getUserController,updateUserController,followUserController,unfollowUserController}