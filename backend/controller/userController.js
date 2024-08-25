const express = require("express");
const User = require("../models/User");
const { CustomError } = require("../middlewares/error");
const Post = require("../models/Post");
const Comments = require("../models/Comments");
const Story = require("../models/Story");

const getUserController = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError("User Not Found", 404);
    }
    const { password, ...data } = user._doc;
    res.status(200).json({
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

const updateUserController = async (req, res, next) => {
  const { userId } = req.params;
  const updateData = req.body;
  try {
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      throw new CustomError("User not found!", 404);
    }
    Object.assign(userToUpdate, updateData);
    const updatedUser = await userToUpdate.save();
    res.status(200).json({
      message: "User Updated Sucessfully !",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const followUserController = async (req, res, next) => {
  const { userId } = req.params;
  const { _id } = req.body;
  try {
    if (userId === _id) {
      throw new CustomError(" sorry:), You can't follow yourself !", 409);
    }
    const userToBeFollowed = await User.findById(userId);
    const userGoingToFollow = await User.findById(_id);
    if (!userToBeFollowed || !userGoingToFollow) {
      throw new CustomError("sorry:),can't find the User !", 404);
    }
    console.log(userGoingToFollow.followings);
    if (userToBeFollowed.followings.includes(_id)) {
      throw new CustomError("You already following this user !", 409);
    }
    userGoingToFollow.followings.push(userId);
    userToBeFollowed.followers.push(_id);
    await userGoingToFollow.save();
    await userToBeFollowed.save();
    res.status(200).json({
      message: "User followed sucessfully !",
    });
  } catch (error) {
    next(error);
  }
};

const unfollowUserController = async (req, res, next) => {
  const { userId } = req.params;
  const { _id } = req.body;
  try {
    if (userId === _id) {
      throw new CustomError("sorry:), You can't unfollow yourself !", 409);
    }
    const userToBeUnfollowed = await User.findById(userId);
    const userGoingToUnfollow = await User.findById(_id);
    if (!userToBeUnfollowed || !userGoingToUnfollow) {
      throw new CustomError("Can't find the User !", 404);
    }
    if (!userGoingToUnfollow.followings.includes(userId)) {
      throw new CustomError("This user not followed by you ", 404);
    }
    userToBeUnfollowed.followers.pull(_id);
    userGoingToUnfollow.followings.pull(userId);
    await userToBeUnfollowed.save();
    await userGoingToUnfollow.save();
    res.status(200).json({ message: "User unfollowed suceesfully" });
  } catch (error) {
    next(error);
  }
};

const blockUserController = async (req, res, next) => {
  const { userId } = req.params;
  const { _id } = req.body;
  try {
    if (userId === _id) {
      throw new CustomError("You can't block yourself", 409);
    }
    const userToBeBlocked = await User.findById(userId);
    const userGoingtoBlock = await User.findById(_id);
    if (!userToBeBlocked || !userGoingtoBlock) {
      throw new CustomError("user not found ! ", 404);
    }
    if (userGoingtoBlock.blockList.includes(userId)) {
      throw new CustomError("User already blocked", 409);
    }
    userGoingtoBlock.blockList.push(userId);
    userGoingtoBlock.followings.pull(userId);
    userToBeBlocked.followers.pull(_id);
    await userGoingtoBlock.save();
    await userToBeBlocked.save();
    res.status(200).json({ message: "User blocked sucessfully !" });
  } catch (error) {
    next(error);
  }
};

const unblockUserController = async (req, res, next) => {
  const { userId } = req.params;
  const { _id } = req.body;
  try {
    if (userId === _id) {
      throw new CustomError("You can't unblock yourself", 409);
    }
    const userToBeUnblocked = await User.findById(userId);
    const userGoingToUnblock = await User.findById(_id);
    if (!userToBeUnblocked || !userGoingToUnblock) {
      throw new CustomError("Your not found !", 404);
    }
    if (!userGoingToUnblock.blockList.includes(userId)) {
      throw new CustomError("You never blocked this person ", 403);
    }
    userGoingToUnblock.blockList.pull(userId);
    await userGoingToUnblock.save();
    res.status(200).json({ message: "User unblocked sucessfully !" });
  } catch (error) {
    next(error);
  }
};
const blockListUserController = async (req, res, next) => {
  console.log("coming");
  const { userId } = req.params;
  console.log("start");
  try {
    const user = await User.findById(userId).populate(
      "blockList",
      "username fullname profilepicture"
    );
    console.log("User fetched:", user); // Add logging here

    if (!user) {
      throw new CustomError("User not found!", 404);
    }

    const { blockList, ...data } = user.toObject(); // Ensure you are working with a plain JS object

    console.log("BlockList:", blockList); // Add logging here
    res.status(200).json(blockList);
  } catch (error) {
    console.error("Error occurred:", error); // Add logging here
    next(error);
  }
};

const deleteUserController = async (req, res, next) => {
    const{userId}=req.params;
  try {
    const userToDelete=await User.findById(userId)
    if(!userToDelete){
        throw new CustomError("User not found !", 404)
    }
    await Post.deleteMany({user:userId})
    await Post.deleteMany({"comments":userId})
    await Post.deleteMany({"comments.replies.user":userId})
    await Comments.deleteMany({user:userId})
    await Story.deleteMany({user:userId})
    await Post.updateMany({likes:userId},{$pull:{likes:userId}})
    await User.updateMany(
        {_id:{$in:userToDelete.followings}},
        {$pull:{followers:userId}}
    )
    await Comments.updateMany({},{$pull:{likes:userId}})
    await Comments.updateMany({"replies.likes":userId},
        {$pull:{"replies.likes":userId}}
        
    )
    await Post.updateMany({},{$pull:{likes:userId}})
    
    const replyComments=await Comments.find({"replies.user":userId})
    await Promise.all(
        replyComments.map(async(comment)=>{
            comment.replies=comment.filter((reply)=>reply.user.toString()!=userId)
            await Comments.save()
        })
    )
    await userToDelete.deleteOne()
 res.status(200).json({message:"User and its data deleted Sucessfully !"})
  } catch (error) {
    next(error);
  }    
};

const searchUserContoller=async(req,res,next)=>{
    const {query}=req.params
    try {
        const users=await User.find({
            $or:[
                {username:{$regex:new RegExp(query,'i')}},
                {fullname:{$regex:new RegExp(query,'i')}}
            ]
        })
        res.status(200).json({data:users})
    } catch (error) {
        next(error)
    }
}

module.exports = {
  getUserController,
  updateUserController,
  followUserController,
  unfollowUserController,
  blockUserController,
  unblockUserController,
  blockListUserController,
  deleteUserController,
  searchUserContoller
};
