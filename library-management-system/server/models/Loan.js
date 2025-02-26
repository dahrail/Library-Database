const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Loan extends Model {}

Loan.init({
  LoanID: {
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
  LoanType: {
    type: DataTypes.ENUM('book', 'media', 'electronic'),
    allowNull: false,
  },
  BorrowedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  DueAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  ReturnedAt: {
    type: DataTypes.DATE,
  },
  RenewalCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  Status: {
    type: DataTypes.ENUM('Active', 'Returned', 'Overdue'),
    defaultValue: 'Active',
  },
}, {
  sequelize,
  modelName: 'Loan',
  tableName: 'loans',
  timestamps: false,
});

module.exports = Loan;