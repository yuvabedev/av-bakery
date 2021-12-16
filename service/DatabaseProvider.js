var util = require('util');
var path = require('path');
var filename = path.basename(__filename);

var connection = require('../db');

var tableName = "";

function executeSaveAndReturnSavedEntityQuery(sql, callback) {
    console.log(util.format('%s: Executing SQL: %s', filename, sql));
    connection.query(sql, function (error, results) {
      if (error) {
        callback(error, results);
      } else {
        returnById(results.insertId, callback);
      }
    });
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

  function returnById(id, callback) {
    var getByIDSql = "SELECT * FROM %s WHERE Id = '%s'";
    getByIdSql = util.format(getByIDSql, tableName, id);
    executeQuery(getByIdSql, callback);
}

function setTableName(table_name) {
  tableName = table_name;
}

  module.exports = {
    executeQuery,
    executeSaveAndReturnSavedEntityQuery,
    setTableName,
  };