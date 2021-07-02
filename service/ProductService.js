var util = require('util');

var path = require('path');
var filename = path.basename(__filename);

var connection = require('../db');

function getAllActiveProducts(callback) {
    var sql = getQueryToSearchProductsByStatus('ACTIVE');
    executeQuery(sql, callback);
}
    

function getQueryToSearchProductsByStatus(status) {
    return util.format("SELECT * FROM `product` WHERE `status` = '%s'", status);
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

  module.exports = {
    getAllActiveProducts
  };