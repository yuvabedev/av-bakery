var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'baker',
  password: 'bread',
  database: 'av_bakery',
  timezone: 'utc + 5:30'
});

connection.connect(function (err) {
  if (err) throw err;
  console.log('Connected to MySQL Database!');
});

module.exports = connection;
