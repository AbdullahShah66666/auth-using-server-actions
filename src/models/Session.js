import mongoose, { Schema } from "mongoose";

const SessionSchema = new Schema(
  {

    //id is also present with _id in the mongo document... which is sent as sessionID in the cookies
    userID: {
      type: String,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Session =
  mongoose.models.Session || mongoose.model("Session", SessionSchema);

export default Session;
