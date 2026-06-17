const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Judicious@41',
  database: 'community_app'
});


module.exports = connection;
