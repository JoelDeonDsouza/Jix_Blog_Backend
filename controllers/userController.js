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
