var util = require('util');

var connection = require('../db');

function searchCustomerByName(searchText, callback) {
  var sql = "SELECT * FROM `customer` WHERE `name` LIKE '%s%'";
  var formattedSql = util.format(sql, searchText);
  executeQuery(formattedSql, callback);
}

function searchCustomerByAccount(searchText, callback) {
  var sql = "SELECT * FROM `customer` WHERE `account` LIKE '%s%'";
  var formattedSql = util.format(sql, searchText);
  executeQuery(formattedSql, callback);
}

function executeQuery(sql, callback) {
  console.log(util.format('Executing SQL: %s', sql));
  connection.query(sql, function (error, results) {
    if (error) {
      callback(error, results);
    } else {
      callback(error, results);
    }
  });
}

module.exports = {
  searchCustomerByName,
  searchCustomerByAccount,
};
