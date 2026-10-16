
import User from "../models/user.model.js";

const getUserInfo= async (req,res)=>{
    try{
        if(!req.user){
            return res.status(401).json({message:"Unauthorized"});
        }

        const user=await User.findById(req.user._id).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json({name:user.name,email:user.email}); 

    }catch(err){
        console.error("Error in getUserInfo:", err);
        return res.status(500).json({message:"Internal server error"});
    }   
}


const updateUser= async (req,res)=>{
    try{
        if(!req.user){
            return res.status(401).json({message:"Unauthorized"});
        }   
        const user=await User.findById(req.user._id).select("-password");
        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        const {name,email}=req.body;
        if(name) user.name=name;
        if(email) user.email=email;
        await user.save();
        return res.status(200).json({message:"User updated successfully",user:{name:user.name,email:user.email}});
    }catch(err){
        console.error("Error in updateUser:", err);
        return res.status(500).json({message:"Internal server error"});
    }
}   

const deleteUser= async (req,res)=>{
    try{
        if(!req.user){ 
            return res.status(401).json({message:"Unauthorized"});
        }
        const user=await User.findById(req.user._id);
        if(!user){
            return res.status(404).json({message:"User not found"});
        }
        await User.deleteOne({ _id: req.user._id });
        return res.status(200).json({message:"User deleted successfully"});
    }catch(err){
        console.error("Error in deleteUser:", err);
        return res.status(500).json({message:"Internal server error"});
    }   
}

export {getUserInfo,updateUser,deleteUser};