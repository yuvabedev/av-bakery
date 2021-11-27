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
 
function returnById(id, tableName, callback) {
    var getByIDSql = "SELECT * FROM %s WHERE Id = '%s'";
    getByIdSql = util.format(getByIDSql, tableName, id);
    executeQuery(getByIdSql, callback);
} 

function getOrderLineItemsByCustomerId(id, callback) {
    var sql = getQueryForOrderLineItemsByCustomerId(id);
    executeQuery(sql, callback);
}

function getOrderLineItemsByCustomerIdAndDeliveryDateLaterThan(criteria, callback) {
  var sql = getQueryForOrderLineItemsByCustomerIdLaterThanStartDate(criteria.customerId, criteria.startDate);
  executeQuery(sql, callback);
}

function getOrderLineItemsByCustomerIdAndDateRange(criteria, callback) {
  var sql = getQueryForOrderLineItemsByCustomerIdAndDateRange(criteria.customerId, criteria.startDate, criteria.endDate);
  executeQuery(sql, callback);
}

function getQueryForOrderLineItemsByCustomerId(id) {
  var sql = "SELECT * FROM `order_line` WHERE customer_id = '%s' ORDER BY delivery_date";
  return util.format(sql, id);
}

function getQueryForOrderLineItemsByCustomerIdAndDateRange(customerId, startDate, endDate) {
  var sql = "SELECT * FROM `order_line` WHERE customer_id = '%s' AND delivery_date >= '%s' AND delivery_date < '%s' ORDER BY delivery_date";
  return util.format(sql, customerId, startDate, endDate);
}

function getQueryForOrderLineItemsByCustomerIdLaterThanStartDate(customerId, startDate) {
  var sql = "SELECT * FROM `order_line` WHERE customer_id = '%s' AND delivery_date >= '%s' ORDER BY delivery_date";
  return util.format(sql, customerId, startDate);
}

function getQueryForDeliverySchedule() {
    return util.format("SELECT * FROM `delivery_schedule` ORDER BY total_deliveries");
}

function getQueryForDeliveryLocation() {
    return util.format("SELECT * FROM `delivery_location` ORDER BY name");
}

function saveOrderSchedule(orderSchedule, callback) {
  var orderScheduleInsertSql = getQueryForSaveOrderSchedule(orderSchedule);
  executeSaveQuery(orderScheduleInsertSql, 'order_schedule', callback);
}

function updateOrderLineItem(orderLineItem, callback) {
  var orderLineItemUpdateSql = getQueryForUpdateOrderLineItem(orderLineItem);
  executeUpdateQuery(orderLineItemUpdateSql, orderLineItem.id, "order_line", callback);
}

function saveOrderLineItem(orderLineItem, callback) {
  var orderLineItemInsertSql = getQueryForSaveOrderLineItem(orderLineItem);
  executeSaveQuery(orderLineItemInsertSql, "order_line", callback);
}

function disableOrderLineItem(orderLineItemId, callback) {
    var disableOrderLineItemSql = getQueryForDisableOrderLineItem(orderLineItemId);
    executeQuery(disableOrderLineItemSql, callback)
} 

function getQueryForSaveOrderSchedule(orderSchedule) {
  var saveOrderScheduleSql = "INSERT INTO order_schedule (customer_id, product_id, product_name, quantity, start_date, delivery_location, total_deliveries, status, notes)\
   VALUES ('%s', '%s', '%s', %s, '%s', '%s', %s, '%s', '%s');"
   return util.format(saveOrderScheduleSql, orderSchedule.customerId, orderSchedule.productId, orderSchedule.productName, orderSchedule.quantity,
     orderSchedule.startDate, orderSchedule.deliveryLocation, orderSchedule.totalDeliveries, orderSchedule.status, orderSchedule.notes);
}

function getQueryForSaveOrderLineItem(orderLineItem) {
  var saveOrderLineItemSql = "INSERT INTO order_line (order_schedule_id, customer_id, product_id, product_name, quantity, delivery_date, delivery_location, status)\
   VALUES ('%s', '%s', '%s', '%s', %s, '%s', '%s', '%s');"
   return util.format(saveOrderLineItemSql, orderLineItem.orderScheduleId, orderLineItem.customerId, orderLineItem.productId, orderLineItem.productName, orderLineItem.quantity,
    orderLineItem.deliveryDate, orderLineItem.deliveryLocation, orderLineItem.status);
}

function getQueryForUpdateOrderLineItem(orderLineItem) {
  var updateOrderLineItemSql = "UPDATE order_line  SET quantity = %s, delivery_location = '%s' WHERE id = '%s'";
    return util.format(updateOrderLineItemSql, orderLineItem.quantity, orderLineItem.deliveryLocation, orderLineItem.id);
}

function getQueryForDisableOrderLineItem(orderLineItemId) {
  var updateOrderLineItemSql = "UPDATE order_line  SET status = '%s' WHERE id = '%s'";
  return util.format(updateOrderLineItemSql, 'INACTIVE', orderLineItemId);
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

  function executeSaveQuery(sql, tableName, callback) {
    console.log(util.format('%s: Executing SQL: %s', filename, sql));
    connection.query(sql, function (error, results) {
      if (error) {
        callback(error, results);
      } else {
        returnById(results.insertId, tableName, callback);
      }
    });
  }

  function executeUpdateQuery(sql, id, tableName, callback) {
    console.log(util.format('%s: Executing SQL: %s', filename, sql));
    connection.query(sql, function (error, results) {
      if (error) {
        callback(error, results);
      } else {
        returnById(id, tableName, callback);
      }
    });
  }
  

  module.exports = {
    getDeliverySchedule,
    getDeliveryLocation,
    saveOrderSchedule,
    saveOrderLineItem,
    getOrderLineItemsByCustomerId,
    getOrderLineItemsByCustomerIdAndDateRange,
    getOrderLineItemsByCustomerIdAndDeliveryDateLaterThan,
    updateOrderLineItem,
    disableOrderLineItem,
  };