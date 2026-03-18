import cloudinary from "../config/cloudinary.js";
import fs from 'fs';
import Discussion from "../models/discussion.models.js";


export const createDiscussion = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title field is required",
      });
    }

    let imageUrl = "";

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "discussions",
      });

      imageUrl = result.secure_url;

      fs.unlinkSync(req.file.path);
    }

    const discussion = new Discussion({
      title,
      description: description || "",
      creator: req.user._id,
      img: imageUrl,
    });

    await discussion.save();

    res.status(201).json({
      success: true,
      message: "Discussion created successfully",
      discussion,
    });

  } catch (error) {
    console.log("Error in createDiscussion controller:", error.message);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllDiscussions = async (req, res) => {
  try {
    const discussions = await Discussion.find({}).sort({ createdAt: -1 });

    if (discussions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No discussions found",
      });
    }

    res.status(200).json({
      success: true,
      message: "All discussions",
      discussions,
    });

  } catch (error) {
    console.log("Error in getAllDiscussions controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;

    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }
    if (discussion.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this discussion",
      });
    }

    await Discussion.findByIdAndDelete(discussionId);

    res.status(200).json({
      success: true,
      message: "Discussion deleted successfully",
    });

  } catch (error) {
    console.log("Error in deleteDiscussion controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text field is required",
      });
    }

    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    const newComment = {
      text,
      user: req.user._id,
    };

    discussion.comment.push(newComment);

    await discussion.save();

    res.status(200).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
    });

  } catch (error) {
    console.log("Error in addComment controller:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const upvoteDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const userId = req.user._id;

    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    if (discussion.upvotes.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You already upvoted this discussion",
      });
    }
    
    discussion.upvotes.push(userId);

    await discussion.save();

    res.status(200).json({
      success: true,
      message: "Discussion upvoted successfully",
      discussion,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const downvoteDiscussion = async (req, res) => {
  try {
    const { discussionId } = req.params;
    const userId = req.user._id;

    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    if (discussion.downvotes.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You already downvoted this discussion",
      });
    }

    discussion.downvotes.push(userId);

    await discussion.save();

    res.status(200).json({
      success: true,
      message: "Discussion downvoted successfully",
      discussion,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { discussionId, commentId } = req.params;

    const discussion = await Discussion.findById(discussionId);

    if (!discussion) {
      return res.status(404).json({
        success: false,
        message: "Discussion not found",
      });
    }

    discussion.comments = discussion.comment.filter(
      (comment) => comment._id.toString() !== commentId
    );

    await discussion.save();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      discussion,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const userDiscussion = async (req, res) => {
  try {
    const userId = req.user._id;

    const discussions = await Discussion.find({ user: userId }).sort({ createdAt: -1 });

    if (!discussions) {
      return res.status(404).json({
        success: false,
        message: "No discussions found",
      });
    }

    res.status(200).json({
      success: true,
      discussions,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};