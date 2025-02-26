const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

class Media extends Model {}

Media.init({
  MediaID: {
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
    type: DataTypes.STRING(100),
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
    allowNull: false,
  },
  ConditionStatus: {
    type: DataTypes.ENUM('New', 'Good', 'Worn', 'Damaged'),
  },
}, {
  sequelize,
  modelName: 'Media',
  tableName: 'media',
  timestamps: false,
});

module.exports = Media;