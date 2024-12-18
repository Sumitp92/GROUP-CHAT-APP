const Sequelize = require('sequelize') ; 
const sequelize = require('../util/databases') ; 

const User = sequelize.define('authtable' , {
    name :{
        type : Sequelize.STRING , 
        allowNull : false
    }, 
    email :{
        type : Sequelize.STRING,
        allowNull : false, 
        unique  : true
    },
    phone:{
        type : Sequelize.STRING,
        allowNull : false , 
        unique : true
    },
    password : {
        type : Sequelize.STRING, 
        allowNull : false
    },
},{
    tableName : 'authtable' , 
    timestamps : true,
});

module.exports = User ; 