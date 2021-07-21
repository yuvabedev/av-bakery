var util = require('util');

var path = require('path');
var filename = path.basename(__filename);

var connection = require('../db');


function getDeliverySchedule(callback) {
    var sql = getQueryForDeliverySchedule();
    executeQuery(sql, callback);
}

function getDeliveryLocation(callback) {
    var sql = getQueryForDeliveryLocation();
    executeQuery(sql, callback);
}
    

function getQueryForDeliverySchedule() {
    return util.format("SELECT * FROM `delivery_schedule` ORDER BY total_deliveries");
}

function getQueryForDeliveryLocation() {
    return util.format("SELECT * FROM `delivery_location` ORDER BY name");
}

function saveOrderSchedule(orderSchedule) {
  var orderScheduleInsertSql = getQueryForSaveOrderSchedule(orderSchedule);
  console.log(orderScheduleInsertSql);
}

function getQueryForSaveOrderSchedule(orderSchedule) {
  var saveOrderScheduleSql = "INSERT INTO order_schedule (customer_id, product_id, product_name, quantity, start_date, delivery_location, total_deliveries, status, notes)\
   VALUES ('%s', '%s', '%s', %s, '%s', '%s', %s, '%s', '%s');"
   return util.format(saveOrderScheduleSql, orderSchedule.customerId, orderSchedule.productId, orderSchedule.productName, orderSchedule.quantity,
     orderSchedule.startDate, orderSchedule.deliveryLocation, orderSchedule.totalDeliveries, orderSchedule.status, orderSchedule.notes);
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
    getDeliverySchedule,
    getDeliveryLocation,
    saveOrderSchedule,
  };