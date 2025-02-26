const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class User extends Model {}

User.init({
  UserID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  FirstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  LastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  Role: {
    type: DataTypes.ENUM('Student', 'Faculty', 'Admin'),
    allowNull: false,
  },
  Email: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false,
  },
  Password: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  PhoneNumber: {
    type: DataTypes.STRING(20),
  },
  RegistrationDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  AccountStatus: {
    type: DataTypes.ENUM('Active', 'Suspended'),
    allowNull: false,
    defaultValue: 'Active',
  },
  BorrowLimit: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: false,
});

module.exports = User;