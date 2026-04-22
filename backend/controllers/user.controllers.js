import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const generateToken = (res, user) => {
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET, 
        {expiresIn: "5y"});

    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 5 * 365 * 24 * 60 * 60 * 1000, // 5 years
    });
}
export const registerUser = async (req, res)=>{
    try{
        const { username, email, password} = req.body;

        if (!username){
            return res.status(422).json({message: "Username is required!"});
        }
        if (!email){
            return res.status(422).json({message: "Email is required"});
        }
        if (!password){
            return res.status(422).json({message: "Password is required!"});
        }
        const existUser = await User.findOne({email})
        if(existUser){
            return res
            .status(400)
            .json({success: false, message: "User already exists"})
        }
        const hashedPassword = bcrypt.hashSync(password, 8);
        const userData = new User({
            Username: username,
            email,
            Password: hashedPassword
        });
        const user = await userData.save();
        generateToken(res,user);
        const { Password: pass, ...rest } = user._doc;
        res.json({
            success: true,
            message: "User registered successfully",
            user: rest,

        });
    } catch (error) {
        res.json({
            success: false,
            message: "Failed to register user",
            error: error.message,
        });
    }
};
export const loginUser = async (req, res)=>{
    try{
        const {email, password} = req.body;

        if (!email){
            return res.status(422).json({message: "Email is required"});
        }
        if (!password){
            return res.status(422).json({message: "Password is required!"});
        }
        const user = await User.findOne({email})
        if(!user){
            return res
            .status(400)
            .json({success: false, message: "User does not exist"})
        }
        const isMatchPassword = bcrypt.compareSync(password, user.Password);
        if (!isMatchPassword) {
            return res.status(400).json({success: false, message: "Invalid credentials"});
        }
        generateToken(res,user);
        const { Password: pass, ...rest } = user._doc;
        res.json({
            success: true,
            message: "User logged in successfully",
            user: rest,

        });
    } catch (error) {
        res.json({
            success: false,
            message: "Failed to login user",
            error: error.message,
        })
    }
};
export const logoutUser = async(req, res) =>{
    res.clearCookie("token");
    res.json({message: "Logged out successfully"});

};
export const profileUser = async (req, res) => {
    try {
        const userId = req .user._id;
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({message: "User not found!"});
        }
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Somthing wrong with user profile",
        });
    }           
};
export const getUserById = async (req, res) => {
    try {
        const userId = req .params;
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({message: "User not found!"});
        }
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Somthing wrong with get user by ID",
        });
    }           
        }
        export const updateProfile = async (req, res) => {
            try {
                const userId = req.user._id;
                const{name, username, email, phone, bio } = req.body;
                const updateData = {};
                if (name) updateData.name = name;
                if (username) updateData.username = username;
                if (email) updateData.email = email;
                if (phone) updateData.phone = phone;
                if (bio) updateData.bio = bio;
                const user = await User.findByIdAndUpdate(userId, updateData, {new: true}).select("Password");
                res.status(200).json({
                    success: true,
                    message: "Profile updated successfully",
                    user,
                });
            } catch (error) {
                res.status(500).json({
                    success: false,

                    message: "Failed to update profile",  
                });
            }
        }