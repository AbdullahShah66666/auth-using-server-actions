import mongoose, { Schema } from "mongoose";

const SessionSchema = new Schema(
  {
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
