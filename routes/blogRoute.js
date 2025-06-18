import express from "express";
import {
  getBlogs,
  getBlog,
  createBlog,
  deleteBlog,
} from "../controllers/blogController.js";

const router = express.Router();

router.get(`/list`, getBlogs);

router.get("/:slug", getBlog);

router.post("/create", createBlog);

router.delete("/delete/:id", deleteBlog);

export default router;
