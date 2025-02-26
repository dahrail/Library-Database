const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class LibraryCard extends Model {}

LibraryCard.init({
  LibraryCardID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserID: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'UserID',
    },
  },
  IssueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  ExpirationDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  Status: {
    type: DataTypes.ENUM('Active', 'Expired', 'Lost'),
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'LibraryCard',
  tableName: 'library_cards',
  timestamps: false,
});

module.exports = LibraryCard;