import { config } from "../config/env.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

const JWT_SECRET= process.env.JWT_SECRET || "your_jwt_secret";

const generateToken = (id, email) =>{
    return jwt.sign({id, email}, config.JWT_SECRET,{expiresIn: "8h"});
    console.log("SECRET_LENGTH:", process.env.JWT_SECRET.length);
}

const registerUser = async (req, res) =>{
    try {
        const { username, email, password } = req.body;

        // basic validation
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        // checking if a user already exist
        const existing = await User.findOne({email: email.toLowerCase()});

        if(existing){
            return res.status(400).json({
                message: "User already exist"
            })
        }

        // create user

        const user = await User.create({
            username,
            email: email.toLowerCase(),
            password,
            loggedIn: false
        });

        res.status(201).json({
            message: "User created succesfully",
            token: generateToken(user._id, user.email),
            user: {id: user._id, username: user.username, email: user.email}
        })

    } catch (error) {
        res.status(500).json({message: "Internal Server Error", error: error.message});
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // checking if user already exist
        const user = await User.findOne({email: email.toLowerCase()}).select("+password");
        if(!user) return res.status(400).json({message: "User not found"});

        const isMatch = await user.comparePassword(password);

        if(!isMatch) return res.status(400).json({
            message: "Invalid credentials"
        })

        res.status(200).json({
            message: "User logged in",
            token: generateToken(user._id, user.email),
            user: user,
        });
    } catch (error) {
         res.status(500).json({message: "Internal Server Error", error: error.message});
    }
}

const logoutUser = async (req, res) =>{
    try {
        const { email } = req.body;

        const user = await User.findOne({email: email.toLowerCase()});

        if(!user) return res.status(400).json({message: "User not found"});

        res.status(200).json({
            message: "User logged out successfully"
        })
    } catch (error) {
        res.status(500).json({message: "Internal Server Error", error: error.message});
    }
}

const getUserProfile = async (req, res) => {

    res.json(req.user);
    // try {
    //    res.json(req.user);
    // } catch (error) {
    //     res.status(500).json({message: "Internal Server Error", error: error.message});
    // }
}

const getUsersProfile = async (req, res) => {
    try {
        const users = await User.find();

        res.status(200).json({
            message: "Users gotten successfully",
            users
        })
        
    } catch (error) {
         res.status(500).json({message: "Internal Server Error", error: error.message});
    }
}

const updateUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update top-level fields
        user.username = req.body.username || user.username;
        user.phone = req.body.phone || user.phone;
        user.avatar = req.body.avatar || user.avatar;

        // Correctly handle the nested address object from the frontend
        if (req.body.address) {
            user.address = {
                street: req.body.address.street || user.address?.street || "",
                city: req.body.address.city || user.address?.city || "",
                state: req.body.address.state || user.address?.state || "",
                country: req.body.address.country || user.address?.country || "",
            };
        }

        const updatedUser = await user.save();

        // Standardize response to match your frontend result.success check
        res.status(200).json({ 
            success: true, 
            message: "Profile updated successfully", 
            updatedUser 
        });
        
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal Server Error", 
            error: error.message 
        });
    }
};

export {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    getUsersProfile,
    updateUserProfile,
}