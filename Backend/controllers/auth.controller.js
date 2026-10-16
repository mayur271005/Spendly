import express from "express";
// import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body || {};

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }
        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({ message: "Invalid input" });
        }

        const normalizedEmail = email.trim().toLowerCase();
        if (!EMAIL_REGEX.test(normalizedEmail)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters" });
        }

        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }


        // const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: password,
        });

        const token = jwt.sign(
            { id: newUser._id, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });


        return res.status(201).json({
            message: "User registered successfully",

            user: { id: newUser._id, name: newUser.name, email: newUser.email },
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ message: "User already exists" });
        }
        console.error("Error in user registration:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const login = async (req, res) => {
    try {

        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        if (typeof email !== "string" || typeof password !== "string") {
            return res.status(400).json({ message: "Invalid input" });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail }).select("+password");
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return res.status(200).json({
            message: "User logged in successfully",
            user: { id: user._id, name: user.name, email: user.email },
        });



    }
    catch (err) {
        console.error("Error in user login:", err);
        return res.status(500).json({ message: "Internal server error" });
    }


}



// export default router;