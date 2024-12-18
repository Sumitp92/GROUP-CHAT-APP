const Sequelize = require('sequelize');
const ChatMessage = require('../model/messages');
const User = require('../model/userdetail'); 
const bcrypt = require('bcrypt');
const sequelize = require('../util/databases');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Function to send a chat message
const sendMessage = async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.id; 

        if (!message) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User  not found' });
        }

        const newMessage = await ChatMessage.create({
            userId, 
            name: user.name, 
            message,
        });

        res.status(201).json({
            success: true,
            message: 'Message sent successfully',
            data: newMessage,
        });
    } catch (err) {
        console.error('Error sending message:', err);
        res.status(500).json({ success: false, message: 'Error sending message' });
    }
};

// Function to get chat messages
const getMessages = async (req, res) => {
    try {
        const messages = await ChatMessage.findAll({
            order: [['createdAt', 'ASC']], 
        });

        res.status(200).json({
            success: true,
            messages,
        });
    } catch (err) {
        console.error('Error fetching messages:', err);
        res.status(500).json({ success: false, message: 'Error fetching messages' });
    }
};

module.exports = { sendMessage, getMessages };