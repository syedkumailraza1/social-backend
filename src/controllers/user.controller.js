import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"



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

const userLogin = async (req,res)=>{
    //get email or username and password from user
    const { username, password } = req.body;
    //console.log(username, password);

    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }
    //check wheater user exists or not

    const user =  await User.findOne(
        { 
           username 
        }
    )

    if (!user) {
        return res.status(404).json({message:"User not exist"})
    }

    //check password
    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid){
        return res.status(400).json({message:"Invalid Password"})
    }
    
    //generate refresh and access tokens

    const {accessToken,refreshToken} = await generateTokens(user._id)
    //console.log("The access Token is: ",accessToken);

    //send the tokens through cookie
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken", refreshToken,options)
    .json({user:loggedInUser,accessToken,refreshToken})

    console.log("User Logged In Successfully!");
        
    
}

const generateTokens = async (userID)=>{
    try {
        const user = await User.findById(userID)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
       await user.save({validationBeforeSave:false})
       return {accessToken,refreshToken}

    } catch (error) {
        console.log("Error while Generating Tokens: ",error)
    }
}

//logout
const userLogout = async (req,res)=>{
    //remove refresh token from user document
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {refreshToken: undefined } 
        },
        {new:true}        
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options)
    .json({message:"Logged out successfully"})
}

const RefreshAccessToken = async (req,res)=>{
   const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
   if(!incommingRefreshToken){
    return res.status(401).json({message:"unAuthorized Token"})
   }
   
   try {
    const decodedToken = jwt.verify(incommingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
    const user = await User.findById(decodedToken._id)
    if(!user){
     return res.status(401).json({message:"Invalid refresh token"})
    }
 
    if(incommingRefreshToken !== user?.refreshToken){
     return res.status(401).json({message:"refresh token is expired or used"})
    }
 
    const options  = {
     httpOnly: true,
     secure: true
    }
 
    const {accessToken,newRefreshToken} = await generateTokens(user._id)
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",newRefreshToken,options)
    .json({accessToken,refreshToken:newRefreshToken})
   } catch (error) {
    return res.status(401).json({error:error}) 
   }
}

export  { registerUser, userLogin, userLogout, RefreshAccessToken}