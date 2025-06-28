/**
 * @author: Joel Deon Dsouza
 * @description: This module defines the routes for blog-related operations in the Express application.
 * It includes routes for creating, retrieving, and deleting blogs, as well as handling image uploads.
 * @version: 1.0.1
 * @date: 2025-06-26
 */

import express from "express";
import {
  getBlogs,
  getBlog,
  createBlog,
  deleteBlog,
  uploadAuth,
  featureBlog,
} from "../controllers/blogController.js";
import visitCount from "../middlewares/visitCount.js";

const router = express.Router();

// router for image upload //
router.get("/upload-auth", uploadAuth);

router.get(`/list`, getBlogs);

router.get("/:slug", visitCount, getBlog);

router.post("/create", createBlog);

router.delete("/delete/:id", deleteBlog);

router.patch("/featured", featureBlog);

export default router;
