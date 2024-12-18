const Sequelize = require('sequelize');
const sequelize = require('../util/databases');  

const ChatMessage = sequelize.define('chatmessage', {

    name : {
        type : Sequelize.STRING , 
        allowNull : false , 
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false,
    },
}, {
    tableName: 'chatmessages', 
    timestamps: true, 
});

module.exports = ChatMessage;
