/**
 * @author: Joel Deon Dsouza
 * @description: This module defines the schema for the Blog model using Mongoose.
 * It includes fields for user reference, cover image, title, slug, category, description,
 * content, featured status, and visit count. The schema also includes timestamps for creation and updates.
 * The `id` virtual field is defined to return the string representation of the MongoDB ObjectId.
 * The schema is then compiled into a Mongoose model named "Blog".
 * @version: 1.0.1
 * @date: 2025-06-26
 */


import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverImg: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      default: "general",
    },
    desc: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    visitCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

blogSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

blogSchema.set("toJSON", {
  virtuals: true,
});

export const Blog = mongoose.model("Blog", blogSchema);
