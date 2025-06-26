/**
 * @author: Joel Deon Dsouza
 * @description: This module establishes a connection to the MongoDB database using Mongoose.
 * It connects to the database using the connection string stored in the environment variable `JIX_DATA_BASE_CONNECTION_STRING`.
 * The database name is set to "jix_blog". Upon successful connection,
 * it logs a success message to the console. If an error occurs during the connection attempt,
 * it logs the error to the console.
 * @version: 1.0.1
 * @date: 2025-06-26
 */


import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connect(process.env.JIX_DATA_BASE_CONNECTION_STRING, {
        dbName: "jix_blog",
      })
      .then(() => {
        console.log("Jix DataBase connection is successfully");
      });
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;