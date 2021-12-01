var express = require('express');
var router = express.Router();
var crypto = require('crypto'); 
var util = require('util');
var path = require('path');

var callbackHelper = require('./CallbackHelper');
var adminService = require('../service/AdminService');

var requestError = {};
var requestData = {};
var filename = path.basename(__filename);


/**
 * handles http request to load the create adming user page
 * Loads the EJS admin/login
 */
 router.get('/adminCreate', (request, response) => {
    console.log("Loading Create admin page");
  
    callbackHelper.setResponse(response);
    callbackHelper.setView("admin/create");
    callbackHelper.renderNextView(requestData, requestError);
  });

  /**
 * handles http request to load the create adming user page
 * Loads the EJS admin/login
 */
 router.get('/viewAdmin', (request, response) => {
  console.log("Fetchin admin user");
  callbackHelper.setResponse(response);


  var adminId = request.query.id;

  if (!callbackHelper.hasValue(adminId)) {
    console.log("User tried to load view admin without an id.")
    callbackHelper.setView("404");
    callbackHelper.renderNextView(requestData, requestError);
    return;
  }

  callbackHelper.setResponse(response);
  callbackHelper.setView("admin/viewEdit");
  adminService.fetchAdminUser("id", adminId, callbackHelper.renderNextViewOrPageNotFoundOnError.bind({ error: requestError, data: requestData }));
});

  /**
 * handles http request to load the create adming user page
 * Loads the EJS admin/login
 */
 router.post('/adminCreate', (request, response) => {
    console.log("Creating admin user....");
    callbackHelper.setResponse(response);

    var adminUser = {};
    adminUser.loginId = request.body.login_id;
    adminUser.firstName = request.body.first_name;
    adminUser.lastName = request.body.last_name;
    adminUser.password = request.body.password;
    console.log(adminUser);

    if (!validateAdminUser(adminUser) || !validatePassword(adminUser.password)) {
      console.log("Request to create admin user failed validation!");
      console.log("Error:" + JSON.stringify(requestError, null, 2))
      callbackHelper.setView("admin/create");
      callbackHelper.renderNextView(requestError, adminUser);  
      return;
    }

    var adminUser = prepareAdminUserForSave(adminUser);
    adminService.saveUserIfLoginIdIsUnique(adminUser, callbackIfLoginIdIsDuplicate, callbackIfLoginIdIsUnique.bind({ error: requestError, data: requestData }));
  });

  function callbackIfLoginIdIsDuplicate(adminUser) {
    console.log("Executing callback: callbackIfLoginIdIsDuplicate");
    callbackHelper.setView("admin/create");
    requestError  = util.format('%s already exist', adminUser.loginId);
    requestData = adminUser;
    callbackHelper.renderNextView(requestError, requestData);
  }

  function callbackIfLoginIdIsUnique(error, data) {
    callbackHelper.setView("admin/viewEdit");
    console.log(util.format("%s: Displaying admin user id: %s", filename, data[0].id));
    callbackHelper.renderNextView(error, data);
  }

  function validateAdminUser(adminUser) {
    var loginId = adminUser.loginId.trim();
    var firstName = adminUser.firstName.trim();
    var lastName = adminUser.lastName.trim();
    var password = adminUser.password.trim();

    if (!callbackHelper.hasValue(loginId)) {
      requestError = 'Please provide Login Id.';
      return false;
    }

    if (loginId.length < 8) {
      requestError = 'Login Id must be at least 8 characters in length.';
      return false;
    }

    if (loginId.indexOf(' ')   >  0) {
      requestError = 'Login Id can not contain space.';
      return false;
    }

    var adminName = util.format('%s %s', firstName, lastName);
    
    if (!callbackHelper.hasValue(adminName)) {
      requestError = 'Please enter either First Name or Last Name.';
      return false;
    }

    if (firstName.length > 0 && firstName.indexOf(' ')   >  0) {
      requestError = 'First Name can not contain space.';
      return false;
    }

    if (lastName.length > 0 && lastName.indexOf(' ')   >  0) {
      requestError = 'Last Name can not contain space.';
      return false;
    }

    if (loginId.indexOf(' ')   >  0) {
      requestError = 'Login Id can not contain space.';
      return false;
    }

    var specialCharacters  = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;

    if (specialCharacters.test(loginId) || /\d/.test(loginId)) {
      requestError = 'Login Id can only contain alphabets (A - Z).';
      return false;
    }

    if (!callbackHelper.hasValue(password)) {
      requestError = 'Password can not be empty.';
      return false;
    }
    return true;
  }

  function validatePassword(password) {
    var password = password.trim();
    if (password.length < 8) {
      requestError = 'Password must be at least 8 digits in length.';
      return false;
    }
    return true;
  }

  function prepareAdminUserForSave(adminUser) {
    adminUser.name = util.format('%s %s', adminUser.firstName.trim(), adminUser.lastName.trim());
    adminUser.loginId = adminUser.loginId.trim().toLowerCase();
    adminUser.password = adminUser.password.trim();
    return adminUser;
  }

  module.exports = router;