/**
 * @author: Joel Deon Dsouza
 * @description: This module defines the routes for user-related operations in the Express application.
 * It includes routes for retrieving saved blogs and saving a blog.
 * @version: 1.0.1
 * @date: 2025-06-26
 */

import express from "express";
import { getSavedBlogs, saveBlog } from "../controllers/userController.js";

const router = express.Router();

router.get("/saved", getSavedBlogs);

router.patch("/save", saveBlog);

export default router;
