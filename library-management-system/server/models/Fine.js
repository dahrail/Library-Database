const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Fine extends Model {}

Fine.init({
  FineID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  LoanID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'loans',
      key: 'LoanID',
    },
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'UserID',
    },
  },
  Amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  IssuedDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  PaidDate: {
    type: DataTypes.DATE,
  },
  Status: {
    type: DataTypes.ENUM('Paid', 'Unpaid'),
    allowNull: false,
    defaultValue: 'Unpaid',
  },
}, {
  sequelize,
  modelName: 'Fine',
  tableName: 'fines',
  timestamps: false,
});

module.exports = Fine;