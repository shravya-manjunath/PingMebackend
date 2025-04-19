import mongoose from "mongoose";

const url = process.env.mongoURL;

export const dbConnect = async () => {
  try {
    console.log("Connecting.....");
    await mongoose.connect(url);
    console.log("Connected to DataBase");
  } catch (error) {
    console.log(error);
  }
};
