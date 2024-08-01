import { User } from "../models/user.model.js"

const getUsers = async (req,res)=>{
 
  try {
    const allUsers = await User.find();
    res.json(allUsers);
} catch (error) {
    res.status(500).json({ error: 'Internal server error:', error });
    console.log(error);
}
}

export default getUsers