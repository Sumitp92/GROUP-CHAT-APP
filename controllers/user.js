const Sequelize = require('sequelize');
const User = require('../model/userdetail');
const bcrypt = require('bcrypt');
const sequelize = require('../util/databases');
const jwt = require('jsonwebtoken') ; 
const JWT_TOKEN = process.env.JWT_TOKEN;
require('dotenv').config();
// Function to Add User
const AddUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        if (!name || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
        });
        res.status(201).json({ success: true, message: 'User signed up successfully' });
        
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ success: false, message: 'Error occurred during signup' });
    }
};

// Function to Login User
const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'User Not Authorized' });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_TOKEN, 
            { expiresIn: '1h' }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).json({ success: false, message: 'Error occurred during login' });
    }
};

module.exports = { AddUser, LoginUser };
