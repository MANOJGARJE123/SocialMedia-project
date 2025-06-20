 import mongoose from "mongoose";
 const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
        unique: true,
    }, 
    gender:{
        type: String,
        required: true,
        enum: ["male", "female"],
    },
    followers:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        }
    ],
    followings:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        }
    ],
    profilePic:{ //both id and url are send by cloudinary
        id:String, //we can updatate the image in cloudinary using this id
        url:String,
      },
    },
    {
        timestamps:true,
    }
);

export const User = mongoose.model("User", userSchema);