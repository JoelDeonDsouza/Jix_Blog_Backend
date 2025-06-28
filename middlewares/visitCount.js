/**
 * @author: Joel Deon Dsouza
 * @description: Middleware to increment the visit count of a blog post based on its slug parameter whenever the route is accessed.
 * @version: 1.0.1
 * @date: 2025-06-28
 */

import { Blog } from "../models/blogModel.js";

const visitCount = async (req, res, next) => {
  const slug = req.params.slug;
  await Blog.findOneAndUpdate({ slug }, { $inc: { visitCount: 1 } });
  next();
};

export default visitCount;
