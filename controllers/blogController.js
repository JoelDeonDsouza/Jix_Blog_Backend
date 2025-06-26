/**
 * @author: Joel Deon Dsouza
 * @description: This module defines the controllers for blog-related operations in the Express application.
 * It includes functions for retrieving a list of blogs, retrieving a single blog by slug, creating a new blog,
 * deleting a blog, and handling image uploads using ImageKit. The module also includes a helper function to generate unique slugs for blogs.
 * The `getBlogs` function supports pagination and populates the user information for each blog.
 * The `createBlog` function validates the request data, checks for the existence of the user by Clerk ID, and generates a unique slug before saving the blog.
 * The `deleteBlog` function checks for user authorization before deleting a blog by its ID.
 * The `uploadAuth` function initializes ImageKit and returns authentication parameters for image uploads.
 * The module uses Mongoose models for interacting with the MongoDB database.
 * @version: 1.0.1
 * @date: 2025-06-26
 */


import ImageKit from "imagekit";
import { Blog } from "../models/blogModel.js";
import { User } from "../models/userModel.js";

export const getBlogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 2;
    const blogList = await Blog.find()
      .populate("user", "username")
      .limit(limit)
      .skip((page - 1) * limit);
    if (!blogList) {
      const error = new Error("No blogs found");
      error.status = 404;
      return next(error);
    }
    const totalBlogs = await Blog.countDocuments();
    const totalPages = page * limit < totalBlogs;
    res.send({ blogList, totalPages });
  } catch (error) {
    next(error);
  }
};

export const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }).populate(
      "user",
      "username img"
    );
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
  try {
    const { title, clerkUserId, coverImg, ...blogData } = req.body;
    if (!clerkUserId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Clerk user ID is required.",
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
    // Validate required fields //
    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required.",
      });
    }
    // Generate unique slug  //
    const slug = await generateUniqueSlug(title);
    // Create blog object
    const blogObject = {
      user: user._id,
      slug,
      title: title.trim(),
      ...blogData,
      coverImg: coverImg || "",
    };
    // Create and save blog //
    const blog = new Blog(blogObject);
    const savedBlog = await blog.save();
    res.status(201).json({
      success: true,
      data: savedBlog,
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to generate unique slug //
const generateUniqueSlug = async (title) => {
  const baseSlug = title
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  let slug = baseSlug;
  let counter = 2;
  while (await Blog.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
};

export const deleteBlog = async (req, res, next) => {
  const { clerkUserId } = req.body;
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

// Initialize ImageKit with error handling //
const initializeImageKit = () => {
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!urlEndpoint || !publicKey || !privateKey) {
    console.error("Missing ImageKit environment variables:", {
      urlEndpoint: !!urlEndpoint,
      publicKey: !!publicKey,
      privateKey: !!privateKey,
    });
    throw new Error(
      "ImageKit configuration is incomplete. Please check your environment variables."
    );
  }
  return new ImageKit({
    urlEndpoint,
    publicKey,
    privateKey,
  });
};

export const uploadAuth = async (req, res, next) => {
  try {
    const imagekit = initializeImageKit();
    const result = imagekit.getAuthenticationParameters();
    res.send(result);
  } catch (error) {
    console.error("ImageKit initialization error:", error.message);
    return res.status(500).json({
      success: false,
      message: "ImageKit service is not properly configured.",
    });
  }
};
