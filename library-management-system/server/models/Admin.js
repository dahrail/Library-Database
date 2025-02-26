const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Admin extends Model {}

Admin.init({
  AdminID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserID: {
    type: DataTypes.INTEGER,
    unique: true,
    allowNull: false,
  },
  Username: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false,
  },
  FirstName: {
    type: DataTypes.STRING(100),
  },
  LastName: {
    type: DataTypes.STRING(100),
  },
  Password: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Admin',
  tableName: 'admins',
  timestamps: false,
});

module.exports = Admin;