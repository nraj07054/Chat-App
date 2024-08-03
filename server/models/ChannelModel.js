import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Users",
      req: true,
    },
  ],
  admin: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
    req: true,
  },
  messages: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Messages",
      req: false,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

channelSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

channelSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

export default mongoose.model("Channels", channelSchema);
