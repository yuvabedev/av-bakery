var express = require('express');

var util = require('util');

var path = require('path');
var filename = path.basename(__filename);

var router = express.Router();

var customerService = require('../service/CustomerService');
var callbackHelper = require('./CallbackHelper');

var requestError = {};
var requestData = {};

/**
 * handles http request to search for customer data with name or account number
 * returns a json with an array of customer objects
 */
router.get('/searchCustomers', (request, response) => {
  if (!validateSearchRequest(request)) {
    response.status(400).send(requestError);
    return;
  }
  var searchString = request.query.searchQuery;
  var searchBy = request.query.searchBy;

  callbackHelper.setResponse(response);

  customerService.searchCustomer(
    searchString,
    searchBy,
    callbackHelper.sendResponse.bind({ error: requestError, data: requestData })
  );
});

/**
 * handles http request to get a customer with a given id. 
 * The id provided as query param: /customerEdit?id={id}
 * returns the json representing customer object
 */
router.get('/customerEdit', (request, response) => {
  var customerId = request.query.customerId;
  console.log(util.format('%s: Editing customer with id: %s', filename, customerId));
  callbackHelper.setResponse(response);
  callbackHelper.setView("customer/edit");
  customerService.fetchCustomer(customerId, 'id', callbackHelper.renderNextView.bind({ error: requestError, data: requestData }));
});

/**
 * handles http request to update a customer
 * The customer data is encapsulated in request body
 * In case of an error with the request, the response is returned to the edit form
 * In case of success the response is rediected to the view page
 */
router.post('/customerSave', (request, response) => {
  var customer = {};
  callbackHelper.httpResponse = response;
  customer.id = request.body.customerId;
  customer.name = request.body.customerName;
  customer.account = request.body.customerAccount;
  customer.community = request.body.customerCommunity;
  customer.phone = request.body.customerPhone;
  customer.email = request.body.customerEmail;
  customer.notes = request.body.customerNotes;
  console.log(customer);

  callbackHelper.setResponse(response);

  if (!validateCustomer(customer)) {
    console.log("Request to edit customer failed validation!");
    callbackHelper.setView("customer/edit");
    var data = [customer];
    callbackHelper.renderNextView(requestError,data);
  } else {
      callbackHelper.setRedirect("customerView?id=" + customer.id)
      customerService.updateCustomer(customer, callbackHelper.redirectRequest.bind({ error: requestError, data: requestData }))
  }
});

router.get('/customerView', (request, response) => {
  var customerId = request.query.id;
  console.log(util.format('%s: Viewing Customer with Id: %s', filename, customerId));

  callbackHelper.setResponse(response);
  callbackHelper.setView("customer/view");
  customerService.fetchCustomer(customerId, 'id', callbackHelper.renderNextView.bind({ error: requestError, data: requestData }));
});

function validateSearchRequest(request) {
  var searchString = request.query.searchQuery;
  var searchBy = request.query.searchBy;

  if (!searchString) {
    requestError = 'Please enter a value to search';
    return false;
  }
  if (!searchBy) {
    requestError = 'Please select whether to search by account or name';
    return false;
  }

  if (searchBy == 'name' && callbackHelper.hasNumber(searchString)) {
    requestError = 'While searching by name do not include numbers in search text';
    return false;
  }

  if (searchBy == 'account' && isNaN(searchString)) {
    requestError = 'While searching by account only include numbers in search text';
    return false;
  }
  return true;
}

function validateCustomer(customer) {
    if (!callbackHelper.hasValue(customer.id)) {
      requestError = 'No customer id defined. Please contact support.';
      return false;
    }
    if (!callbackHelper.hasValue(customer.name)) {
      requestError = 'Name can not be empty.';
      return false;
    }
    if (!callbackHelper.hasValue(customer.account)) {
      requestError = 'Account can not be empty.';
      return false;
    }
    if (!callbackHelper.hasValue(customer.community)) {
      requestError = 'Community can not be empty.';
      return false;
    }
    if (!callbackHelper.hasValue(customer.phone)) {
      requestError = 'Phone can not be empty.';
      return false;
    }
    if (!callbackHelper.hasValue(customer.email)) {
      requestError = 'E-mail can not be empty.';
      return false;
    }
    return true;
  }

module.exports = router;