const Sequelize = require('sequelize');
const sequelize = require('../util/databases');

const Message = sequelize.define('message', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    groupId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'group', 
            key: 'id'
        }
    },
    message: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    tableName: 'message',
    timestamps: true,
});

module.exports = Message;