const Sequelize = require('sequelize');
const sequelize = require('../util/databases');

const UploadHistory = sequelize.define('uploadHistory', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    file_url: {
        type: Sequelize.STRING,
        allowNull: false
    },
    file_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    upload_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'uploadHistory',
    timestamps: true
});

module.exports = UploadHistory;