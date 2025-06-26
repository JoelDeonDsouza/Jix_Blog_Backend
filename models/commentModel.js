/**
 * @author: Joel Deon Dsouza
 * @description: This module defines the schema for comments in the Jix application.
 * It includes fields for the user who made the comment, the blog the comment is associated with,
 * and the content of the comment itself. The schema also includes timestamps for when the comment was
 * created and updated. The `id` virtual field is defined to return the string representation of
 * the MongoDB ObjectId. The schema is then compiled into a Mongoose model named "Comment".
 * @version: 1.0.1
 * @date: 2025-06-26
 */

import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

commentSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

commentSchema.set("toJSON", {
  virtuals: true,
});

export const Comment = mongoose.model("Comment", commentSchema);
