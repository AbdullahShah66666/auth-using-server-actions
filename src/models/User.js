import mongoose, { Schema } from "mongoose";


/* if (process.env.NODE_ENV === "development") {
  delete mongoose.models.User;
} */

const UserSchema = new Schema(
  {
    _id: {
      type: String,
      default: crypto.randomUUID(),
      //    default: "crypto.randomUUID()",
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
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User;
