import mongoose from "mongoose";
import { messageSchema } from "./message.Schema.js";

const messageModel = mongoose.model('Messages',messageSchema);

export class messageRepository{
    createMessage = async (userId,roomId,message,type) => {
        try {
            const newMessage = new messageModel({
                room: roomId,
                type: type,
                user: userId,
                message: message
            });
            if(newMessage){
                return await newMessage.save();
            }
        } catch (error) {
            throw error;
        }
    }

    getMessageByRoom = async (roomId) =>{
        try {
            const messages = await messageModel.find({room:roomId}).populate('user');
            if(messages){
                return messages;
            }
        } catch (error) {
            console.log(error);
        }
    }
}