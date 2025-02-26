const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Electronics extends Model {}

Electronics.init({
  DeviceID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Brand: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  Model: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  SerialNumber: {
    type: DataTypes.STRING,
    unique: true,
  },
  Status: {
    type: DataTypes.ENUM('Available', 'Loaned', 'Maintenance', 'Lost'),
    defaultValue: 'Available',
    allowNull: false,
  },
  PurchaseDate: {
    type: DataTypes.DATE,
  },
  Notes: {
    type: DataTypes.TEXT,
  },
}, {
  sequelize,
  modelName: 'Electronics',
  tableName: 'electronics',
  timestamps: false,
});

module.exports = Electronics;