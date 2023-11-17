import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  bio: String,
  chatUsers: [
    {
      _id: {
        type: String,
        required: true
      },
      id: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      lastMessage: {
        type: String,
        required: true
      },
      messageType: {
        type: String,
        required: true
      },
      messageStatus: {
        type: String,
        required: true
      },
      messageAuthor: {
        type: String,
        required: true
      },
      timeStamp: {
        type: Date,
        required: true
      },
    }
  ],
  threads: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Thread",
    },
  ],
  onboarded: {
    type: Boolean,
    default: false,
  },
  communities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
    },
  ],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
