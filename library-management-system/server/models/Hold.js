const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Hold extends Model {}

Hold.init({
  HoldID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ItemID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  ItemType: {
    type: DataTypes.ENUM('Book', 'Media', 'Electronics'),
    allowNull: false,
  },
  RequestedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  HoldStatus: {
    type: DataTypes.ENUM('Pending', 'Active', 'Fulfilled', 'Canceled'),
    allowNull: false,
    defaultValue: 'Pending',
  },
  NotificationSent: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  sequelize,
  modelName: 'Hold',
  tableName: 'holds',
  timestamps: false,
});

module.exports = Hold;