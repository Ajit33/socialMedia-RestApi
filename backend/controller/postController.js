const { CustomError } = require("../middlewares/error");
const Post = require("../models/Post");
const User = require("../models/User");
const createPostController = async(req, res, next) => {
    const{userId,caption}=req.body
  
  try {
    const user=await User.findById(userId)
    if(!user){
        throw new CustomError("User not found ! please Provide a valid Id",404)
    }
    
    const newpost= new Post({
        user:userId,
        caption
    })
   
    await newpost.save()
    user.posts.push(newpost._id)
    await user.save()
    res.status(200).json({
        message:"post created sucessfully !",
        data:user
    })
  } catch (error) {
    next(error);
  }
};

const generateFileUrl=(filename)=>{
    return process.env.URL+`/uploads/${filename}`
}


const createPostWithImagesController=async(req,res,next)=>{
    const {userId}=req.params;
    const {caption}=req.body;
    const files=req.files
    console.log(userId,caption,files)
    try {
        const user= await User.findById(userId);
        if(!user){
            throw new CustomError("User not found !",404)
        }
    const imageUrls=files.map(file=>generateFileUrl(file.filename))
    const newpost=new Post ({
        user:userId,
        caption,
        image:imageUrls

    })
    await newpost.save()
    user.posts.push(newpost._id)
    await user.save()
    res.status(200).json({
        message:"Post created Sucessfully !",
        data:newpost
    })
    } catch (error) {
        next(error)
    }
} 


const updatePostController=async(req,res,next)=>{
   const{postId}=req.params
   const caption=req.body
    try {
        const PostToBeUpdate=await Post.findById(postId)
        if(!PostToBeUpdate){
            throw new CustomError("Post not found !",404)
        }
        console.log(caption)
        PostToBeUpdate.caption=caption || PostToBeUpdate.caption
        await PostToBeUpdate.save()
        console.log(PostToBeUpdate)
        res.status(200).json({
            message:"post updated sucessfully !",
            data:PostToBeUpdate
        })
    } catch (error) {
        next(error)
    }
}



module.exports = {
  createPostController,
  createPostWithImagesController,
  updatePostController
};
