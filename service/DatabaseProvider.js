var connection = require('../db');

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

  module.exports = {
    executeQuery,
    executeSaveAndReturnSavedEntityQuery,
  };