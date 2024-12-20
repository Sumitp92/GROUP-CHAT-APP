const express = require('express');
const router = express.Router();
const { createGroup, inviteUser, fetchUserGroups, getGroups , fetchMessages, sendMessage , makeAdmin , removeUser } = require('../controllers/group');
const {authenticate} = require('../middlewares/authenticate');

router.post('/groups', authenticate, createGroup);
// router.get('/groups' , authenticate,  getGroups) ;
router.post('/groups/invite', authenticate, inviteUser);
router.get('/groups', authenticate, fetchUserGroups);
router.get('/messages/:groupName', authenticate, fetchMessages);
router.post('/messages/:groupName', authenticate, sendMessage);
router.post('/groups/makeAdmin', authenticate, makeAdmin);
router.post('/groups/removeUser', authenticate, removeUser); 

module.exports = router;