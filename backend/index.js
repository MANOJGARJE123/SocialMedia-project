import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './dataabse/db.js';
import cloudinary from 'cloudinary';
import cookieParser from 'cookie-parser';
import { Chat } from './models/ChatModel.js';
import { isAuth } from './middlewares/isAuth.js';
import { User } from './models/userModel.js';

dotenv.config();
cloudinary.v2.config({
    cloud_name: process.env.Cloudinary_Cloud_Name,  
    api_key: process.env.Cloudinary_Api,            
    api_secret: process.env.Cloudinary_Secret       
});

const app = express();


//using middleware
app.use(express.json());
app.use(cookieParser());

const port = 7000;

app.get("/", (req, res) => {
    res.send("server is working");
});

app.get("/chats",isAuth, async(req,res)=>{
    try{
        const chats = await Chat.find({
            users: req.user._id,
        }).populate({
            path: "users",
            select:"name profilePic",
        })

        chats.forEach((e)=>{
            e.users = e.users.filter(
                (user) => user._id.toString() !== req.user._id.toString()
            )
        });

        res.send(chats)
    }catch(error){
        res.status(500).json({
            message:error.message,
        })
    }
})

app.get("/api/user/all", isAuth, async (req, res) => {
  try {
    const search = req.query.search || "";
    // Find users whose name matches the search query, excluding the logged-in user
    const users = await User.find({
      name: { 
        $regex: search, 
        $options: "i" // case-insensitive search
      },
      _id: { $ne: req.user._id } // exclude logged-in user
    }).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});



//importing routes
import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import postRoutes from './routes/postRoutes.js'
import messageRoutes from './routes/messageRoutes.js'


//using routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/messages",messageRoutes)

//using routes
app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`);
    connectDb()
});
