import { User } from "../models/user.model.js";

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
        const user = await User.findOne({email: email.toLowerCase()});
        if(!user) return res.status(400).json({message: "User not found"});

        const isMatch = await user.comparePassword(password);

        if(!isMatch) return res.status(400).json({
            message: "Invalid credentials"
        })

        res.status(200).json({
            message: "User logged in",
            user: {id: user._id, username: user.username, email: user.email}
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

export {
    registerUser,
    loginUser,
    logoutUser
}