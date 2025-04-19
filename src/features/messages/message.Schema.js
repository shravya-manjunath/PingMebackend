import mongoose from "mongoose";

const messageSchema = mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "Users",
  },
  room: {
    type: mongoose.Types.ObjectId,
    ref: 'Room'
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  type:{
    type:String,
    default:'normal'
  }
});

export { messageSchema };
