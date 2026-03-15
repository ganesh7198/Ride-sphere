import cloudinary from '../config/cloudinary.js';
import Post from '../models/post.models.js'
import Notification from '../models/notification.models.js';
import fs from 'fs'

export const createPostController = async (req, res) => {
  try {
    const { text } = req.body;

    let profileImgUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts-app",
      });

      profileImgUrl = result.secure_url;

      fs.unlinkSync(req.file.path);
    }

    const newPost = new Post({
      user: req.user._id,
      text: text || "",
      img: profileImgUrl,
    });

    await newPost.save();

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      newPost,
    });

  } catch (error) {
    console.log("Error in createPostController:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllPost = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate("user", "username profileImg")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(totalPosts / limit),
      totalPosts,
      posts
    });

  } catch (error) {

    console.log("Error in getAllPost:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};

export const getAllPostByUser=async (req,res)=>{
   try{
       const userId=req.user._id;
       const userPost=await Post.find({user:userId});
       res.status(200).json({success:true,message:"all post by the user ",userPost});
   }catch(error){
    console.log('error in the get all post by user controller ',error.message);
    res.status(500).json({success:false ,message:"intrnal server error "});
   }
}

export const deletePostByUser = async (req, res) => {
  try {

    const userId = req.user._id;
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "No post found"
      });
    }

    if (post.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this post"
      });
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully"
    });

  } catch (error) {

    console.log("Error in deletePostByUser:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

export const commentInThePost = async (req, res) => {
  try {
    const { text } = req.body;
    const userId = req.user._id;
    const { postId } = req.params;

    if (!text || text.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const newComment = {
      user: userId,
      text,
    };

    post.comment.push(newComment);

    await post.save();

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
    });

  } catch (error) {
    console.log("Error in commentInThePost:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const likeThePost = async (req, res) => {
  try {

    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "No post found"
      });
    }

    const isLiked = post.likes.includes(userId);

    if (isLiked) {

    
      const disLikePost = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
      ).populate("user");
         
      return res.status(200).json({
        success: true,
        message: "Post unliked",
        post: disLikePost
      });

    } else {

     
      const likedPost = await Post.findByIdAndUpdate(
        postId,
        { $push: { likes: userId } },
        { new: true }
      ).populate("user");
      const notification= await Notification.create({
        sender:userId,
        receiver:likedPost.user,
        type:"like_the_post"
      })

      return res.status(200).json({
        success: true,
        message: "Post liked",
        post: likedPost
      });
    }

  } catch (error) {

    console.log("error in likeThePost controller:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};

export const deleteCommmentOnThePost = async (req, res) => {
  try {

    const { postId, commentId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "No post found"
      });
    }

 
    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found"
      });
    }

    
    if (comment.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this comment"
      });
    }

    
    await Post.findByIdAndUpdate(
      postId,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Post comment deleted successfully"
    });

  } catch (error) {

    console.log("error in delete comment controller", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};

export const updatePostController= async(req,res)=>{
 try{
     
   
  }catch(error){
console.log('error in the update post  controller',error.message);
res.status(500).json({success:false,message:"intrnal server error "});
  }
}

export const getSinglePost = async (req, res) => {
  try {

    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "No post found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Post fetched successfully",
      post
    });

  } catch (error) {

    console.log("error in getSinglePost controller", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }
};