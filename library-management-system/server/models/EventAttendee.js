const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class EventAttendee extends Model {}

EventAttendee.init({
  EventAttendeeID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  EventID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  RegisteredDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  CheckedIn: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
}, {
  sequelize,
  modelName: 'EventAttendee',
  tableName: 'eventAttendees',
  timestamps: false,
});

module.exports = EventAttendee;