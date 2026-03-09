import express from 'express'
import upload from '../middlewares/multer.middlewares.js';
import { protectedRoute } from '../utils/protectedroute.js';
import { commentInThePost, createPostController, deleteCommmentOnThePost, deletePostByUser, getAllPost, getAllPostByUser, getSinglePost, likeThePost, updatePostController } from '../controllers/post.controllers.js';

const router=express.Router();

router.post("/create",protectedRoute,upload.single("img"),createPostController)
router.get("/allpost",protectedRoute,getAllPost);
router.get("/allpostbyuser",protectedRoute,getAllPostByUser);
router.delete("/delete/:postId",protectedRoute,deletePostByUser);
router.post("/comment/:postId",protectedRoute,commentInThePost);
router.post("/likepost/:postId",protectedRoute,likeThePost);
router.delete("/deletecomment/:postId/:commentId",protectedRoute,deleteCommmentOnThePost);
router.post("/updatepost/:postId",protectedRoute,updatePostController);
router.get("/getsinglepost/:postId",protectedRoute,getSinglePost)


export default router;