const jwt = require('jsonwebtoken');
const User = require('../model/userdetail');
const JWT_TOKEN = process.env.JWT_TOKEN;

const authenticate = async (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    
        const token = authorizationHeader.split(' ')[1]; 
    
        if (!token) {
            return res.status(403).json({ success: false, message: 'No token found' });
        }

    try {
        const { userId } = jwt.verify(token, JWT_TOKEN);
        const user = await User.findByPk(userId);

        req.user = { id: userId };
        next();
    } catch (err) {
        res.status(403).json({ success: false, message: 'Failed to authenticate token' });
    }
};

module.exports = { authenticate };