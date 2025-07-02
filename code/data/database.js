const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  database: "fligh",
  user: "root",
  password: "10.41UnizA",
});

module.exports = pool;
