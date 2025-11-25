import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './dataabse/db.js';
import cloudinary from 'cloudinary';
import cookieParser from 'cookie-parser';
import { Chat } from './models/ChatModel.js';
import { isAuth } from './middlewares/isAuth.js';
import { User } from './models/userModel.js';
import { app, server } from "./Socket/socket.js";

dotenv.config();
cloudinary.v2.config({
    cloud_name: process.env.Cloudinary_Cloud_Name,  
    api_key: process.env.Cloudinary_Api,            
    api_secret: process.env.Cloudinary_Secret       
});

app.use(express.json());
app.use(cookieParser());

const port = 7000;

app.get("/", (req, res) => {
    res.send("server is working");
});

app.get("/api/messages/chats", isAuth, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const chats = await Chat.find({
      users: req.user._id,
    }).populate({
      path: "users",
      select: "name profilePic emailDomain",
    });

    const filteredChats = chats.filter((chat) => {
      const otherUsers = chat.users.filter(
        (user) => user._id.toString() !== req.user._id.toString()
      );
      return otherUsers.length > 0 && otherUsers.every(
        (user) => user.emailDomain === currentUser.emailDomain
      );
    });

    filteredChats.forEach((e) => {
      e.users = e.users.filter(
        (user) => user._id.toString() !== req.user._id.toString()
      );
    });

    res.json(filteredChats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


app.get("/api/user/all", isAuth, async (req, res) => {
  try {
    const search = req.query.search || "";
    const currentUser = await User.findById(req.user._id);
    
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const users = await User.find({
      name: { 
        $regex: search, 
        $options: "i"
      },
      emailDomain: currentUser.emailDomain,
      _id: { $ne: req.user._id }
    }).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import postRoutes from './routes/postRoutes.js'
import messageRoutes from './routes/messageRoutes.js'

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/messages",messageRoutes)

server.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
    connectDb()
});
