const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

const User = sequelize.define('User', {
  email: DataTypes.STRING,
  password: DataTypes.STRING
});

module.exports = { sequelize, User };