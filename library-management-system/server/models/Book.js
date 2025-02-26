const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Book extends Model {}

Book.init({
  BookID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  Title: {
    type: DataTypes.STRING(200),
    allowNull: false,
  },
  AuthorCreator: {
    type: DataTypes.STRING(200),
  },
  Genre: {
    type: DataTypes.ENUM('Fiction', 'Non-Fiction', 'Reference', 'Biography', 'Science', 'History', 'Arts', 'Other'),
  },
  PublicationYear: {
    type: DataTypes.INTEGER,
  },
  Publisher: {
    type: DataTypes.STRING(100),
  },
  Language: {
    type: DataTypes.STRING(50),
  },
  Format: {
    type: DataTypes.STRING(50),
  },
  ISBN10: {
    type: DataTypes.STRING(10),
    unique: true,
  },
  ISBN13: {
    type: DataTypes.STRING(13),
    unique: true,
  },
  ConditionStatus: {
    type: DataTypes.ENUM('New', 'Good', 'Worn', 'Damaged'),
  },
}, {
  sequelize,
  modelName: 'Book',
  tableName: 'book',
  timestamps: false,
});

module.exports = Book;