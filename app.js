import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import http from "http";
// Imports for database connection and routes //
import connectDB from "./lib/connectDB.js";
import userRoute from "./routes/userRoute.js";
import blogRoute from "./routes/blogRoute.js";
import commentRoute from "./routes/commentRoute.js";
import webhookRoute from "./routes/webhookRoute.js";

const app = express();
// Server //
const server = http.createServer(app);
app.use("/webhooks", webhookRoute);
// middleware //
app.use(express.json());
dotenv.config();
// cors fontend connenction //
app.use(cors());

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
