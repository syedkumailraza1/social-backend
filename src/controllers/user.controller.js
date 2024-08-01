import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const registerUser = async (req,res)=>{
    //take user input in all the fields
    const {email,username,password,fullname} = req.body

    //check if no required field is empty
    if(!email){
        return res.status(400).json({message:"Email is required"})
    }
    if(!username){
        return res.status(400).json({message:"Username is required"})
    }
    if(!password){
        return res.status(400).json({message:"Password is required"})
    }
    if(!fullname){
        return res.status(400).json({message:"Full Name is required"})
    }
    
    res.status(200).json({
        email:email,
        username:username,
        password:password,
        fullname:fullname
    })
    
    //check if user already exist
    const existingUserName = await User.findOne({username})
    const existingEmail = await User.findOne({email})

    if(existingEmail){
        console.log('User Already Exist');
    }
    if(existingUserName){
        return res.status(400).json({message:"Username already exist"})
    }

    //get image from user and check
    const profilePicLocalPath = req.files?.profilePic[0]?.path
    if(!profilePicLocalPath){
        return res.status(400).json({message:"Profile Pic is required"})
    }
    console.log(profilePicLocalPath);

    const profilePic = await uploadOnCloudinary(profilePicLocalPath)
    if (!profilePic) {
        return res.status(400).json({ message: "Failed to upload profile picture" });
    }
    
    //store all the data in the mongoDB
   
    const user = await User.create({
        email,
        username:username.toLowerCase(),
        password,
        fullname,
        profilePic: profilePic
    })
    console.log(user._id)

    // //give the message to the user that data is stored
    const createdUser = await User.findById(user._id).select("-password -refreshToken")
    if (!createdUser) {
        res.status(500).json({message:"Failed to create user"})
    }

    console.log("User Created Successfully!");
    
}

export default registerUser