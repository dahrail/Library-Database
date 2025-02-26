const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Event extends Model {}

Event.init({
  EventID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  HostUserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  EventName: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  Description: {
    type: DataTypes.TEXT,
  },
  StartTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  EndTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  RoomID: {
    type: DataTypes.INTEGER,
  },
  MaxAttendees: {
    type: DataTypes.INTEGER,
  },
  Status: {
    type: DataTypes.ENUM('Scheduled', 'Canceled', 'Completed'),
    allowNull: false,
    defaultValue: 'Scheduled',
  },
}, {
  sequelize,
  modelName: 'Event',
  tableName: 'events',
  timestamps: false,
});

module.exports = Event;