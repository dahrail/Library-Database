const mysql = require('mysql2');

const pool = mysql.createPool({
  host: "team7library.mysql.database.azure.com",
  user: "Team7Admin",
  password: "Admin123uma",
  database: "librarynew",
  connectionLimit: 5,
  ssl: {
    rejectUnauthorized: true, // Ensures SSL is used
  },
});

module.exports = pool;