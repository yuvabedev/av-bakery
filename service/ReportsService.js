var util = require('util');

var path = require('path');
var filename = path.basename(__filename);

var connection = require('../db');

function getProductsAndQuantityGroupedForDate(criteriaDate, callback) {
    var sql = getQueryForProductQuantityForDate(criteriaDate);
    executeQuery(sql, callback);
}

function getProductsQuantityAndLocationGroupedForDate(criteriaDate, callback) {
  var sql = getQueryForProductQuantityLocationByDate(criteriaDate);
  executeQuery(sql, callback);
}
    

function getQueryForProductQuantityForDate(criteriaDate) {
    return util.format("SELECT product_name, sum(quantity) AS quantity FROM `order_line` WHERE `delivery_date` = '%s' GROUP BY product_name", criteriaDate);
}

function getQueryForProductQuantityLocationByDate(criteriaDate) {
  return util.format("SELECT product_name, delivery_location, sum(quantity) AS quantity FROM `order_line` WHERE `delivery_date` = '%s' GROUP BY product_name, delivery_location", criteriaDate);
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
    getProductsAndQuantityGroupedForDate,
    getProductsQuantityAndLocationGroupedForDate
  };