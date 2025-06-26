import express from "express";
import { getComments, getBlogComments, createComment, deleteComment } from "../controllers/blogComments.js";

const router = express.Router();

router.get("/list", getComments);

router.get("/:blogId", getBlogComments);

router.post("/", createComment);

router.post("/:id", deleteComment);



export default router;
