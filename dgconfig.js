const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: "192.168.1.59",
  user: "user",
  password: "123",
  database: "cmisdb",
  connectionLimit: 5,
});

module.exports = pool;
