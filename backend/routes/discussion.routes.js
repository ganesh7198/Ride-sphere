import express from 'express'
import { protectedRoute } from '../utils/protectedroute.js';
import upload from '../middlewares/multer.middlewares.js';
import { createDiscussion ,getAllDiscussions,deleteDiscussion,addComment , upvoteDiscussion , downvoteDiscussion ,deleteComment , userDiscussion} from '../controllers/discussion.controllers.js';

const router =express.Router();

router.post("/create", protectedRoute, upload.single("img") ,createDiscussion)

router.get("/all", protectedRoute, getAllDiscussions)

router.delete("/:discussionId", protectedRoute, deleteDiscussion)

router.post("/:discussionId/comment", protectedRoute, addComment)

router.post("/:discussionId/upvote", protectedRoute, upvoteDiscussion)

router.post("/:discussionId/downvote", protectedRoute, downvoteDiscussion)

router.delete("/:discussionId/comment/:commentId", protectedRoute, deleteComment)

router.get("/user/discussion",protectedRoute,userDiscussion)



export default router;