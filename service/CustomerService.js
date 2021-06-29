var util = require('util');

var path = require('path');
var filename = path.basename(__filename);

var connection = require('../db');

function searchCustomer(searchText, searchBy, callback) {
  var sql = getQueryForSearchBy(searchBy);
  var formattedSql = util.format(sql, searchText);
  executeQuery(formattedSql, callback);
}

function fetchCustomer(value, getBy, callback) {
  var sql = getQueryForFetch(getBy);
  var formattedSql = util.format(sql, value);
  executeQuery(formattedSql, callback);
}

function executeQuery(sql, callback) {
  console.log(util.format('%s: Executing SQL: %s', filename, sql));
  connection.query(sql, function (error, results) {
    if (error) {
      callback(error, results);
    } else {
      callback(error, results);
    }
  });
}

function saveCustomer(customer, callback) {

}

function getQueryForSave(customer) 

function getQueryForFetch(getBy) {
  return util.format("SELECT * FROM `customer` WHERE `%s` = '%s'", getBy);
}

function getQueryForSearchBy(searchBy) {
  return util.format("SELECT * FROM `customer` WHERE `%s` LIKE '%s%'", searchBy);
}
module.exports = {
  searchCustomer,
  fetchCustomer,
};
