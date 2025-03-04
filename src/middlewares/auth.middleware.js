import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"


export const verifyJWT = async (req,res,next)=>{
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
    // console.log(token);
    if (!token) {
        throw new ApiError(401, "Unauthorized request")
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

    if (!user) {
      req.status(400).json({message:"Invalid Access Token"})
    }

    req.user = user;
    next()
} catch (error) {
    console.log("Internal Server Error",error);
    return res.status(500).json({ message: "Internal Server Error" });
    
   }
}
