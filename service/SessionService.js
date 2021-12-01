var util = require('util');

var path = require('path');
var filename = path.basename(__filename);

var connection = require('../db');

var adminService = require('./AdminService');

function loginUser(credentials, callbackIfLoginSuccessful, callbackIfLoginFailed) {
  var sql = "SELECT * FROM admin_user WHERE login_id = '%s'";
  sql = util.format(sql, credentials.loginId);
  connection.query(sql, function (error, results) { 
    if (error) {
      //do nothing for now....
    } else {
      console.log(results);
      //if results.length > 0 it means that login id exists
      if (results.length > 0) {
        console.log(util.format("%s: User found with login id %s", filename, credentials.loginId));
        adminService.fetchAdminUser('login_id', credentials.loginId, callbackIfLoginSuccessful);
      } else {
        console.log(util.format("%s: Login attempt failed for login id %s", filename, credentials.loginId));
        callbackIfLoginFailed(credentials);
      }
    }
  });
}

module.exports = {
  loginUser,
};
