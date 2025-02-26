const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RoomReservation = sequelize.define('RoomReservation', {
  RoomReservationID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  RoomID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  StartTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  EndTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Purpose: {
    type: DataTypes.STRING(200),
  },
  Status: {
    type: DataTypes.ENUM('Pending', 'Confirmed', 'Canceled', 'Completed'),
    defaultValue: 'Pending',
  },
}, {
  tableName: 'RoomReservation',
  timestamps: false,
});

module.exports = RoomReservation;