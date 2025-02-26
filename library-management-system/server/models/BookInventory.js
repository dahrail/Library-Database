const db = require('../config/db');

const BookInventory = {
  BookInventoryID: {
    type: 'INT',
    primaryKey: true,
    autoIncrement: true,
  },
  BookID: {
    type: 'INT',
    allowNull: false,
    references: {
      model: 'book',
      key: 'BookID',
    },
  },
  TotalCopies: {
    type: 'INT',
    allowNull: false,
    defaultValue: 0,
  },
  AvailableCopies: {
    type: 'INT',
    allowNull: false,
    defaultValue: 0,
  },
  ShelfLocation: {
    type: 'VARCHAR(50)',
  },
};

module.exports = BookInventory;