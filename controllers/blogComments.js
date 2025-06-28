/**
 * @author: Joel Deon Dsouza
 * @description: This module defines the controller functions for handling blog comments in the Express application.
 * It includes functions to get all comments, get comments for a specific blog, create a new comment, and delete a comment.
 * The comments are associated with users and blogs, and the module handles validation and error management for comment creation and deletion.
 * The `getComments` function retrieves all comments from the database, while `getBlogComments` fetches comments for a specific blog identified by `blogId`.
 * The `createComment` function validates the input, finds the user by their Clerk ID, and creates a new comment associated with the user and blog.
 * The `deleteComment` function allows users to delete their comments by providing their Clerk user ID and the comment ID.
 * @version: 1.0.1
 * @date: 2025-06-26
 */


import { Comment } from "../models/commentModel.js";
import { User } from "../models/userModel.js";

// getComments function to fetch all comments //
export const getComments = async (req, res, next) => {
  try {
    const commentList = await Comment.find();
    if (!commentList) {
      const error = new Error("No Comments found");
      error.status = 404;
      return next(error);
    }
    res.send(commentList);
  } catch (error) {
    next(error);
  }
};

// getBlogComments function to fetch comments for a specific blog //
export const getBlogComments = async (req, res) => {
  const comments = await Comment.find({ blog: req.params.blogId })
    .populate("user", "username img")
    .sort({ createdAt: -1 });
  res.json(comments);
};

// createComment function to handle comment creation //
export const createComment = async (req, res, next) => {
  try {
    const { clerkUserId, blogId, desc } = req.body;
    // Validate required fields //
    if (!clerkUserId || !blogId || !desc) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: clerkUserId, blogId, and desc are required.",
      });
    }
    // Find user by Clerk ID //
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    // Create new comment //
    const newComment = new Comment({
      user: user._id,
      blog: blogId,
      desc: desc.trim(),
    });
    const savedComment = await newComment.save();
    res.status(201).json({
      success: true,
      data: savedComment,
      message: "Comment created successfully.",
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message:
          "Validation error: " +
          Object.values(error.errors)
            .map((e) => e.message)
            .join(", "),
      });
    }
    // Handle duplicate key errors //
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate entry error.",
      });
    }
    next(error);
  }
};

// deleteComment function to handle comment deletion //
export const deleteComment = async (req, res) => {
  const { clerkUserId, id } = req.body;
  if (!clerkUserId || !id) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Clerk user ID / ID is required.",
    });
  }
  const user = await User.findOne({ clerkUserId });
  const deleteBlog = await Comment.findOneAndDelete({
    _id: id,
    user: user._id,
  });
  if (!deleteBlog) {
    return res.status(404).json({
      success: false,
      message: "Comment not found or you are not authorized to delete it.",
    });
  }
  res.status(200).json("Comment deleted successfully");
};
