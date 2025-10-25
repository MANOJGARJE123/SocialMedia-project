import { Chat } from "../models/ChatModel.js";
import { Messages } from "../models/Messages.js";
import { getReciverSocketId, io } from "../Socket/socket.js";
import TryCatch from "../utils/TryCatch.js";

//handle chat message controller
export const sendMessage = TryCatch(async (req, res) => {
  const { recieverId, message } = req.body;
  const senderId = req.user._id; //logged-in user via authentication middleware

  if (!recieverId)
    return res.status(400).json({ message: "Please give receiver id" });

  let chat = await Chat.findOne({
    users: { $all: [senderId, recieverId] },
  });

  if (!chat) {
    chat = new Chat({
      users: [senderId, recieverId],
      latestMessage: {
        text: message,
        sender: senderId,
      },
    });
    await chat.save(); 
  }

  const newMessage = new Messages({
    chatId: chat._id,
    sender: senderId,
    text: message,
  });

  await newMessage.save(); 


  await chat.updateOne({
    latestMessage: {
      text: message,
      sender: senderId,
    },
  });

  // Real-time socket emit INSIDE the function
  const reciverSocketId = getReciverSocketId(recieverId);
  
  if (reciverSocketId) {
    io.to(reciverSocketId).emit("newMessage", newMessage); 
  }

  res.status(201).json(newMessage);
});


export const getAllMessages = TryCatch(async(req,res)=>{
    const { id } = req.params;
    const userId = req.user._id; //current log in use (me)

    const chat = await Chat.findOne({
        users:{$all:[userId, id]},
    });

    if(!chat) return res.status(404).json({
        message:"No Chat with these users"
    });

    const messages = await Messages.find({ //Fetch messages
        chatId: chat._id,
    })

    res.json(messages);
});









