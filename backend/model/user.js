const Sequelize = require('sequelize');
const database = require('../database/database');
 
const User = database.define('user', {
    userName: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isAdmin: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
})
 
module.exports = User;