const db = require('../config/db');

const MediaInventory = {
  MediaInventoryID: {
    type: db.Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  MediaID: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: 'media',
      key: 'MediaID',
    },
  },
  TotalCopies: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  AvailableCopies: {
    type: db.Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  ShelfLocation: {
    type: db.Sequelize.STRING(50),
  },
};

module.exports = (sequelize) => {
  const MediaInventoryModel = sequelize.define('MediaInventory', MediaInventory, {
    tableName: 'MediaInventory',
    timestamps: false,
  });

  return MediaInventoryModel;
};