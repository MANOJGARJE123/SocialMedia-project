import TryCatch from "../utils/TryCatch.js";
import { User} from "../models/userModel.js"
import getDataUrl from "../utils/urlGenrator.js";
import cloudinary from "cloudinary"
import bcrypt from "bcrypt";

export const myProfile = TryCatch(async(req, res)=>{
    const user = await  User.findById(req.user._id).select("-password");

    res.json(user);
})

export const userProfile = TryCatch(async (req, res) => {
    // Find user by ID and exclude password
    const user = await User.findById(req.params.id).select("-password");

    // If no user is found, return a 404 error
    if (!user) {
        return res.status(404).json({
            message: "No user found",
        });
    }

    // If user is found, return the user data (excluding password)
    res.json(user);
});

export const followandUnfollowUser = TryCatch(async (req, res) => {
    const user = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "No User with this id" });

    if (user._id.toString() === loggedInUser._id.toString()) {
        return res.status(404).json({ message: "You cant follow yourself" });
    }

    if (user.followers.includes(loggedInUser._id)) {
        const indexFollowing = loggedInUser.followings.indexOf(user._id);
        const indexFollower = user.followers.indexOf(loggedInUser._id);

        loggedInUser.followings.splice(indexFollowing, 1);
        user.followers.splice(indexFollower, 1);

        await loggedInUser.save();
        await user.save();

        res.json({ message: "User Unfollowed" });
    } else {
        loggedInUser.followings.push(user._id);
        user.followers.push(loggedInUser._id);

        await loggedInUser.save();
        await user.save();

        res.json({ message: "User Followed" });
    }
})
 
export const userfollowerandFollowingData = TryCatch(async(req,res)=>{
    const user =  await User.findById(req.params.id)
    .select("-password")
    .populate("followers","-password").populate("followings","-password");
    

    const followers = user.followers;
    const followings = user.followings;

    res.json({
        followers,
        followings,
    });
});

export const updateProfile = TryCatch(async(req, res)=>{
    const user = await User.findById(req.user._id);

    const{ name } = req.body;

    if(name){
        user.name = name;
    }

    const file = req.file
    if(file){
        const fileUrl = getDataUrl(file);
        await cloudinary.v2.uploader.destroy(user.profilePic.id); 

        const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content)

        user.profilePic.id = myCloud.public_id;
        user.profilePic.url = myCloud.secure_url;
    }

    await user.save()

    res.json({
        message:"Profile update",
    })
})

export const updatePassword = TryCatch(async (req, res) => {
    const user = await User.findById(req.user._id);
    const { oldPassword, newPassword } = req.body;

    // Log the received passwords to verify they are correct
    console.log("Old Password:", oldPassword);
    console.log("New Password:", newPassword);

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Both old and new passwords are required." });
    }

    // Compare old password with the stored password
    const comparePassword = await bcrypt.compare(oldPassword, user.password);
    if (!comparePassword) {
        return res.status(400).json({
            message: "Wrong old password",
        });
    }

    // Ensure newPassword is valid
    if (!newPassword) {
        return res.status(400).json({ message: "New password is required." });
    }

    // Hash the new password before saving
    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.json({
        message: "Password Updated",
    });
});


