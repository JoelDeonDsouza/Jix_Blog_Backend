import { Blog } from "../models/blogModel.js";
import { User } from "../models/userModel.js";

export const getBlogs = async (req, res, next) => {
  try {
    const blogList = await Blog.find();
    if (!blogList) {
      const error = new Error("No blogs found");
      error.status = 404;
      return next(error);
    }
    res.send(blogList);
  } catch (error) {
    next(error);
  }
};

export const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      const error = new Error("Blog not found");
      error.status = 404;
      return next(error);
    }
    res.send(blog);
  } catch (error) {
    next(error);
  }
};

export const createBlog = async (req, res, next) => {
  const clerkUserId = req.auth?.userId;
  if (!clerkUserId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Clerk user ID is required.",
    });
  }
  const user = await User.findOne({ clerkUserId });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }
  try {
    const blog = new Blog({ user: user._id, ...req.body });
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req, res, next) => {
  const clerkUserId = req.auth?.userId;
  if (!clerkUserId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Clerk user ID is required.",
    });
  }
  const user = await User.findOne({ clerkUserId });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }
  Blog.findByIdAndDelete({ _id: req.params.id, user: user._id })
    .then((blog) => {
      if (blog) {
        return res
          .status(200)
          .json({ success: true, message: "Blog was deleted." });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "Blog not found" });
      }
    })
    .catch((error) => {
      next(error);
    });
};
