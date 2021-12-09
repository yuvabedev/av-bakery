var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'avb.yuvabe.com',
  user: 'developer',
  password: 'dev_password',
  database: 'av_bakery',
  timezone: 'utc + 5:30'
});

connection.connect(function (err) {
  if (err) throw err;
  console.log('Connected to MySQL Database!');
});

module.exports = connection;
