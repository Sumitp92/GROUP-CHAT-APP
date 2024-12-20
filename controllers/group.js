const Sequelize = require('sequelize');
const Group = require('../model/group');
const User = require('../model/userdetail');
const Message = require('../model/messages');
const sequelize = require('../util/databases');
const GroupMembers = require('../model/member');
const jwt = require('jsonwebtoken');
require('dotenv').config();


// Function to create a group
const createGroup = async (req, res) => {
    try {
        const { groupname } = req.body;
        const userId = req.user.id;

        if (!groupname) {
            return res.status(400).json({ success: false, message: 'Group name is required' });
        }

        // Check for duplicate group name
        const existingGroup = await Group.findOne({ where: { groupname } });
        if (existingGroup) {
            return res.status(400).json({ success: false, message: 'Group name already exists' });
        }

        const newGroup = await Group.create({ userId, groupname });

        // Add the creator to the group members table as admin
        await GroupMembers.create({ groupId: newGroup.id, userId, isAdmin: true });

        res.status(201).json({ success: true, message: 'Group created successfully', data: newGroup });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ success: false, message: 'Error creating group' });
    }
};


// Function to get all groups
const getGroups = async (req , res) =>{
    try{
        const groups = await Group.findAll({
            order: [['createdAt', 'ASC']], 

        });
        res.status(200).json({
            success: true,
            groups,
        });
    }
    catch(err){
        console.error('Error fetching groups:', err);
        res.status(500).json({ success: false, message: 'Error fetching groups' });
    }
};

const inviteUser = async (req, res) => {
    try {
        const { email, groupName } = req.body;
        const userId = req.user.id;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const group = await Group.findOne({ where: { groupname: groupName } });
        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }

        const isAdmin = await GroupMembers.findOne({ where: { groupId: group.id, userId, isAdmin: true } });
        if (!isAdmin) {
            return res.status(403).json({ success: false, message: 'Only admins can invite users' });
        }

        // Add the user to the group members table
        await GroupMembers.create({ groupId: group.id, userId: user.id });

        res.status(200).json({ success: true, message: 'User invited successfully' });
    } catch (error) {
        console.error('Error inviting user:', error);
        res.status(500).json({ success: false, message: 'Failed to invite user' });
    }
};

const fetchUserGroups = async (req, res) => {
    try {
        const userId = req.user.id;

        const groupMembers = await GroupMembers.findAll({ where: { userId } });
        const groupIds = groupMembers.map(member => member.groupId);

        const groups = await Group.findAll({ where: { id: groupIds } });

        res.status(200).json({ success: true, groups });
    } catch (error) {
        console.error('Error fetching user groups:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch user groups' });
    }
};

// Fetch messages for a group
const fetchMessages = async (req, res) => {
    try {
        const { groupName } = req.params;
        const userId = req.user.id;

        const group = await Group.findOne({ where: { groupname: groupName } });
        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found' });
        }

        const isMember = await GroupMembers.findOne({ where: { groupId: group.id, userId } });
        if (!isMember) {
            return res.status(403).json({ success: false, message: 'User  is not a member of this group' });
        }

        const messages = await Message.findAll({
            where: { groupId: group.id },
            order: [['createdAt', 'ASC']],
            include: [{
                model: User, 
                attributes: ['id', 'name'] 
            }]
        });

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch messages' });
    }
};

// Send a message to a group
const sendMessage = async (req, res) => {
    const { groupName } = req.params;
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message cannot be empty' });
    }

    try {
        const group = await Group.findOne({ where: { groupname: groupName } });
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const groupId = group.id;
        const userId = req.user.id;

        const isMember = await GroupMembers.findOne({ where: { groupId, userId } });
        if (!isMember) {
            return res.status(403).json({ success: false, message: 'User is not a member of this group' });
        }

        const newMessage = await Message.create({
            userId,
            groupId,
            message
        });

        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

const makeAdmin = async (req, res) => {
    const { userEmail } = req.body;
    const currentUserId = req.user.id;

    if (!userEmail) {
        return res.status(400).json({ success: false, message: 'User email is required' });
    }

    try {
        const currentUser = await GroupMembers.findOne({ where: { userId: currentUserId } });
        if (!currentUser || !currentUser.isAdmin) {
            return res.status(403).json({ success: false, message: 'Only admins can make other users admins' });
        }

        const user = await User.findOne({ where: { email: userEmail } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const groupMember = await GroupMembers.findOne({ where: { userId: user.id } });
        if (!groupMember) {
            return res.status(404).json({ success: false, message: 'User not found in the group' });
        }

        groupMember.isAdmin = true;
        await groupMember.save();

        res.status(200).json({ success: true, message: 'User is now an admin' });
    } catch (error) {
        console.error('Error making user admin:', error);
        res.status(500).json({ success: false, message: 'Failed to make user admin' });
    }
};

const removeUser = async (req, res) => {
    const { userEmail } = req.body;
    const currentUserId = req.user.id;

    if (!userEmail) {
        return res.status(400).json({ success: false, message: 'User email is required' });
    }

    try {
        const currentUser = await GroupMembers.findOne({ where: { userId: currentUserId } });
        if (!currentUser || !currentUser.isAdmin) {
            return res.status(403).json({ success: false, message: 'Only admins can remove users' });
        }

        const user = await User.findOne({ where: { email: userEmail } });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const groupMember = await GroupMembers.findOne({ where: { userId: user.id } });
        if (!groupMember) {
            return res.status(404).json({ success: false, message: 'User not found in the group' });
        }

        await groupMember.destroy();

        res.status(200).json({ success: true, message: 'User removed from the group' });
    } catch (error) {
        console.error('Error removing user:', error);
        res.status(500).json({ success: false, message: 'Failed to remove user' });
    }
};

module.exports = { fetchUserGroups , createGroup, getGroups , inviteUser, fetchMessages, sendMessage , makeAdmin , removeUser }; 

