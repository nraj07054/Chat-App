import Users from "../models/UserModel.js";
import Channels from "../models/ChannelModel.js";
import mongoose from "mongoose";

export const createChannel = async (req, res, next) => {
  try {
    const { name, members } = req.body;

    const admin = req.userId;

    if (!admin) {
      return res.status(400).send("Admin user not found.");
    }

    const validMembers = await Users.find({ _id: { $in: members } });

    if (validMembers.length != members.length) {
      return res.status(400).send("Some members are not valid.");
    }

    const newChannel = new Channels({ name, members, admin });

    await newChannel.save();
    return res.status(201).json({ channel: newChannel });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const getUserChannels = async (req, res, next) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);

    const channels = await Channels.find({
      $or: [{ admin: userId }, { members: userId }],
    }).sort({ updatedAt: -1 });

    return res.status(200).json({ channels });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

export const getChannelMessages = async (req, res, next) => {
  try {
    const { channelId } = req.params;
    console.log(channelId);

    const channel = await Channels.findById(channelId).populate({
      path: "messages",
      populate: {
        path: "sender",
        select: "firstName lastName email _id image color",
      },
    });

    if (!channel) {
      return res.status(404).send("Channel not found.");
    }

    const messages = channel.messages;

    return res.status(200).json({ messages });
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
