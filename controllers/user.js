const Sequelize = require('sequelize');
const User = require('../model/userdetail');
const bcrypt = require('bcrypt');
const sequelize = require('../util/databases');

const AddUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Validate required fields
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

module.exports = AddUser;
