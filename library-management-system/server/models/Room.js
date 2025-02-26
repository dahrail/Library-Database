const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Room extends Model {}

Room.init({
  RoomID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  RoomNumber: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  Capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  RoomName: {
    type: DataTypes.STRING(50),
  },
  Notes: {
    type: DataTypes.TEXT,
  },
  Status: {
    type: DataTypes.ENUM('Available', 'Maintenance', 'Reserved'),
    defaultValue: 'Available',
  },
}, {
  sequelize,
  modelName: 'Room',
  tableName: 'Rooms',
  timestamps: false,
});

module.exports = Room;