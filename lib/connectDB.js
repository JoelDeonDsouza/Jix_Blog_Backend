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