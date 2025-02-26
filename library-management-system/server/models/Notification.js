const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Notification extends Model {}

Notification.init({
  NotificationID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  MessageType: {
    type: DataTypes.ENUM('Due Date Reminder', 'Overdue Alert', 'Hold Ready', 'Event Reminder', 'System Notice'),
    allowNull: false,
  },
  MessageContent: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  SentDateTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Acknowledged: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  sequelize,
  modelName: 'Notification',
  tableName: 'notifications',
  timestamps: false,
});

module.exports = Notification;