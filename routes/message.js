const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/chat');
const {authenticate} = require('../middlewares/authenticate'); 

router.post('/messages', authenticate , sendMessage);
 router.get('/messages', authenticate, getMessages);

module.exports = router;
