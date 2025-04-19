import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { userRepository } from "./src/features/users/users.Repository.js";
import { roomRepository } from "./src/features/room/room.Repository.js";
import { messageRepository } from "./src/features/messages/message.Repository.js";

const app = express();
dotenv.config();
app.use(cors());

const server = http.createServer(app);

const userController = new userRepository();
const roomController = new roomRepository();
const messageController = new messageRepository();

const io = new Server(server, {
  cors: {
    origin: "*",
    method: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  //Login
  socket.on("verify", async (data, callback) => {
    const { phone, password } = data;

    const user = await userController.verifyUser(phone, password);

    if (user) {
      callback({
        success: true,
        message: "Login successful",
        user: user,
      });
    } else {
      callback({
        success: false,
        message: "Invalid credentials",
      });
    }
  });

  //Signup
  socket.on("signup", async (data, callback) => {
    try {
      const { name, phone, password, photo } = data;

      const user = await userController.createUser(
        name,
        phone,
        password,
        photo
      );

      if (user) {
        callback({
          success: true,
        });
      } else {
        callback({
          success: false,
          message: "Something went wrong while creating user",
        });
      }
    } catch (error) {
      callback({
        success: false,
        message: "User exists with the phone number",
      })
    }
  });

  //Create new Room
  socket.on("croom", async (data, callback) => {
    const { name, image } = data;

    const room = await roomController.createRoom(name, image);

    if (room) {
      callback({
        success: true,
      });
    } else {
      callback({
        success: false,
      });
    }
  });

  //Rooms  List
  socket.on("room", async (data, callback) => {
    const rooms = await roomController.getAll();
    callback({
      success: true,
      rooms: rooms,
    });
  });

  //join Room
  socket.on("join", async (data, callback) => {
    try {
      const { room, user } = data;

      if (!room || !room._id || !user || !user._id) {
        return callback({
          success: false,
          message: "Invalid room or user data",
        });
      }

      const res = await roomController.addUser(room._id, user._id);

      if (res) {
        socket.join(res._id);

        const message = await messageController.createMessage(
          user._id,
          room._id,
          `${user.name} has joined the room`,
          "info"
        );
        await roomController.addMessage(room._id, message._id);

        callback({
          success: true,
          message: "Successfully joined the room",
        });

        socket.to(room._id).emit("infoMessage", {
          message: message,
        });
      } else {
        callback({
          success: false,
          message: "Failed to add user to the room",
        });
      }
    } catch (error) {
      console.log(error);

      callback({
        success: false,
        message: "An error occurred while joining the room",
      });
    }
  });

  //Previous messages
  socket.on("getMessages", async (data, callback) => {
    try {
      const messages = await messageController.getMessageByRoom(data.roomId);
      if (messages) {
        callback({
          success: true,
          messages: messages,
        });
      }
    } catch (e) {
      callback({
        success: false,
        message: "An error occurres while fetching the messages",
      });
    }
  });

  socket.on("sendMessage", async (data) => {
    try {
      const { roomId, user, message } = data;

      const m = await messageController.createMessage(
        user._id,
        roomId,
        message,
        "text"
      );

      const res = await roomController.addMessage(roomId, m._id);

      await m.populate("user");

      if (res) {
        socket.to(roomId).emit("message", {
          message: m,
        });
      } else {
        console.log("Failed to send message");
      }
    } catch (error) {
      console.log(error);
    }
  });

  // Disconnecting room
  socket.on("leaveRoom", async (data) => {
    try {
      const { roomId, userId } = data;

      socket.leave(roomId);
      const room = await roomController.deleteUser(roomId, userId);

      if (!room) {
        console.log("Failed to remove user from room");
        return;
      }

      let persons = room.user.map((u) => u.name).join(",");
      if(persons.length === 0){
        persons = "No one";
      }

      const message = await messageController.createMessage(
        userId,
        room._id,
        `${persons} are present in room`,
        "info"
      );
      const res = await roomController.addMessage(room._id, message._id);

      if (res) {
        socket.to(roomId).emit("infoMessage", {
          message: message,
        });
      } else {
        console.log("Failed to add message to room");
      }
    } catch (e) {
      console.log(e);
    }
  });
});

export default server;
