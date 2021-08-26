var util = require('util');

var path = require('path');
var filename = path.basename(__filename);

var connection = require('../db');

function getProductsAndQuantityGroupedByDate(criteriaDate, callback) {
    var sql = getQueryForProductsAndQuantityByDate(criteriaDate);
    executeQuery(sql, callback);
}
    

function getQueryForProductsAndQuantityByDate(criteriaDate) {
    return util.format("SELECT product_name, count(product_name) AS quantity FROM `order_line` WHERE `delivery_date` = '%s' GROUP BY product_name", criteriaDate);
}

function executeQuery(sql, callback) {
    console.log(util.format('%s: %s', filename, sql));
    connection.query(sql, function (error, results) {
      if (error) {
        callback(error, results);
      } else {
        callback(error, results);
        console.log(results);
      }
    });
  }

  module.exports = {
    getProductsAndQuantityGroupedByDate
  };