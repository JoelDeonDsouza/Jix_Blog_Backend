/**
 * @author: Joel Deon Dsouza
 * @description: This module defines the routes for comment-related operations in the Express application.
 * It includes routes for retrieving comments, creating new comments, and deleting comments associated with blogs.
 * @version: 1.0.1
 * @date: 2025-06-26
 */

import express from "express";
import {
  getComments,
  getBlogComments,
  createComment,
  deleteComment,
} from "../controllers/blogComments.js";

const router = express.Router();

router.get("/list", getComments);

router.get("/:blogId", getBlogComments);

router.post("/", createComment);

router.post("/:id", deleteComment);

export default router;
