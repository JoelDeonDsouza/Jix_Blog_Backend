/**
 * @author: Joel Deon Dsouza
 * @description: This module defines the user controller for handling user-related operations in the Express application.
 * It includes functions to get saved blogs for a user and to save a blog to the user's saved blogs list.
 * The controller interacts with the User model to perform database operations.
 * The `getSavedBlogs` function retrieves the saved blogs for a user based on their Clerk user ID.
 * The `saveBlog` function allows a user to save a blog by its ID, ensuring that the user exists and the blog is not already saved.
 * If the required fields are missing or the user is not found, appropriate error responses are returned.
 * Error handling is implemented to catch and log any issues during the database operations.
 * @version: 1.0.1
 * @date: 2025-06-26
 */



import { User } from "../models/userModel.js";

// Get saved blogs for a user //
export const getSavedBlogs = async (req, res, next) => {
  const { clerkUserId } = req.query;
  if (!clerkUserId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Clerk user ID is required.",
    });
  }
  try {
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    res.status(200).json(user.saveBlogs);
  } catch (error) {
    console.error("Error retrieving saved blogs:", error);
    next(error);
  }
};

// Save a blog to the user's saved blogs list //
export const saveBlog = async (req, res, next) => {
  const { clerkUserId, blogId } = req.body;
  if (!clerkUserId || !blogId) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields: clerkUserId and blogId are required.",
    });
  }
  try {
    const user = await User.findOne({ clerkUserId });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    if (user.saveBlogs.includes(blogId)) {
      return res.status(400).json({
        success: false,
        message: "Blog is already saved.",
      });
    }
    user.saveBlogs.push(blogId);
    await user.save();
    res.status(200).json({
      success: true,
      message: "Blog saved successfully.",
    });
  } catch (error) {
    console.error("Error saving blog:", error);
    next(error);
  }
};
