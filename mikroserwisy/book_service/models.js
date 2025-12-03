const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

const Book = sequelize.define('Book', {
  title: DataTypes.STRING,
  author: DataTypes.STRING,
  year: DataTypes.INTEGER
});

module.exports = { sequelize, Book };