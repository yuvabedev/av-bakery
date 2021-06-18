var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'baker',
  password: 'bread',
  database: 'av_bakery',
});

connection.connect(function (err) {
  if (err) throw err;
  console.log('Connected to MySQL Database!');
});

module.exports = connection;
