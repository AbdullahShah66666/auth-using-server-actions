import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected"))
  .catch(err => console.error("Error:", err));