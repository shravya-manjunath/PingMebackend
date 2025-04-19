import mongoose from "mongoose";
import { roomSchema } from "./room.Schema.js";

const roomModel = mongoose.model("Room", roomSchema);

export class roomRepository {
  createRoom = async (name, image) => {
    try {
      const newRoom = new roomModel({
        name: name,
        image: image,
        user: [],
        messages: []
      });
      if (newRoom) {
        return await newRoom.save();
      }
    } catch (error) {
      throw error;
    }
  };

  getAll = async()=>{
    try {
      const rooms = await roomModel.find();

      if(!rooms){
        throw new Error('Something went wrong while fetching');
      }
      return rooms;
    } catch (error) {
      throw error;
    }
  }

  addUser = async (id, userId) => {
    try {
      const room = await roomModel.findById(id);

      if (!room) {
        throw new Error(`Room with id ${id} not found`);
      }
      if (!room.user.includes(userId)) {
        room.user.push(userId);
        await room.save();
      }

      return room;
    } catch (error) {
      throw error;
    }
  };

  addMessage = async (id, messageId) => {
    try {
      const room = await roomModel.findById(id);

      if (!room) {
        throw new Error(`Room with id ${id} not found`);
      }
      room.messages.push(messageId);
      return await room.save();
    } catch (error) {
      throw error;
    }
  };


  deleteUser = async (id,userId) => {
    try {
        const room = await roomModel.findById(id).populate('user');
        if(room){
            room.user = room.user.filter(u => u._id.toString() !== userId.toString());
            await room.save();
            return room;
        }
    } catch (error) {
        throw error;
    }
  }
}
