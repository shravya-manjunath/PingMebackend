import mongoose from "mongoose";

const roomSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type:String,
    required:true
  },
  user: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Users",
    },
  ],
  messages: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Messages",
    },
  ],
});

export { roomSchema };
