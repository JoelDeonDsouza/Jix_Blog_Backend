/**
 * @author: Joel Deon Dsouza
 * @description: This module defines the user schema for the MongoDB database using Mongoose.
 * It includes fields for the Clerk user ID, username, email, profile image, and saved blogs.
 * The schema also includes timestamps for creation and updates. The `id` virtual field is defined to return the string representation of the MongoDB ObjectId.
 * The schema is then compiled into a Mongoose model named "User".
 * @version: 1.0.1
 * @date: 2025-06-26
 */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    img: {
      type: String,
      required: false,
    },
    saveBlogs: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});

export const User = mongoose.model("User", userSchema);
