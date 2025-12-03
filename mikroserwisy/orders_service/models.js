const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

const Order = sequelize.define('Order', {
  userId: DataTypes.INTEGER,
  bookId: DataTypes.INTEGER,
  quantity: DataTypes.INTEGER
});

module.exports = { sequelize, Order };
