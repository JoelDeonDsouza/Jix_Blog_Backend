/**
 * @author: Joel Deon Dsouza
 * @description: This is the main entry point for the Express application.
 * It sets up the server, connects to the database, and configures routes and middleware.
 * @version: 1.0.1
 * @date: 2025-06-26
 */

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import morgan from "morgan";
import { clerkMiddleware } from "@clerk/express";

// Imports for database connection and routes //
import connectDB from "./lib/connectDB.js";
import userRoute from "./routes/userRoute.js";
import blogRoute from "./routes/blogRoute.js";
import commentRoute from "./routes/commentRoute.js";
import webhookRoute from "./routes/webhookRoute.js";

const app = express();
app.use(clerkMiddleware());
// Server //
const server = http.createServer(app);

// middleware //
app.use(cors());
app.use(morgan("dev"));
app.use("/webhooks", webhookRoute);
app.use(express.json());

// ImageKit configuration //
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// routes //
app.use("/users", userRoute);
app.use("/blogs", blogRoute);
app.use("/comments", commentRoute);

// Unknown routes //
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

// Centralized error handler //
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message:
      error.message ||
      "An unexpected error has occurred. Please try again later.",
    status: error.status,
  });
});

// Server connection and database initialization //
const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
  const port = server.address().port;
  connectDB();
  console.log("Express is running on Port " + port);
});
