const { response } = require("express");
const asynchandler = require("express-async-handler");
const { Error, model } = require("mongoose");
const User = require('../models/User');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const bcrypt= require('bcrypt');


const test = function (req, res) {
    res.json("Hello");
};


const registerUser = asynchandler(async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }
        
        const hashedPassword = await bcrypt.hash(password,10);  // This hashed passowrd is what we will be storing in database


        const createdUser = await User.create(
                                            { username : username, 
                                                password : hashedPassword
                                            }
                                        );

        const token = jwt.sign(
            { userID: createdUser._id , username: createdUser.username},
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        // {sameSite:"none", secure:true} this part is added because diff host can also access the cookie
        res.cookie('token', token, {sameSite:"none", secure:true}).status(201).json({ id: createdUser._id,username });

    } catch (error) {
        console.error('Error in registerUser:', error.message); // Log error message
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

const userProfile = async (req, res) => {
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, userData) => {
        if (err) {
            return res.status(401).json({ error: 'User is not authorized' });
        }

        res.json(userData);
    });
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const foundUser = await User.findOne({ username });

        if (foundUser && await bcrypt.compare(password, foundUser.password)) {
            const token = jwt.sign(
                { userID: foundUser._id, username: foundUser.username },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            // {sameSite:"none", secure:true} this part is added because diff host can also access the cookie
            res.cookie('token', token, { sameSite: "none", secure: true }).status(200).json({ id: foundUser._id, username });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error });
    }
};


module.exports = { test, registerUser ,userProfile,loginUser};
