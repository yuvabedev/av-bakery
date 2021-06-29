var express = require('express');

var util = require('util');

var path = require('path');
var filename = path.basename(__filename);

var router = express.Router();

var customerService = require('../service/CustomerService');
var utility = require('./Utility');

var httpResponse = {};
var requestError = {};
var requestData = {};
var nextView = "";
var nextRedirect = "";

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

  httpResponse = response;

  customerService.searchCustomer(
    searchString,
    searchBy,
    sendResponse.bind({ error: requestError, data: requestData })
  );
});

/**
 * handles http request to get a customer with a given id. 
 * The id provided as query param: /customerEdit?id={id}
 * returns the json representing customer object
 */
router.get('/customerEdit', (request, response) => {
  httpResponse = response;
  var customerId = request.query.customerId;
  console.log(util.format('%s: Fetching Customer Id: %s', filename, customerId));
  nextView = "customer/edit";
  customerService.fetchCustomer(customerId, 'id', renderNextView.bind({ error: requestError, data: requestData }));
});

/**
 * handles http request to update a customer
 * The customer data is encapsulated in request body
 * In case of an error with the request, the response is returned to the edit form
 * In case of success the response is rediected to the view page
 */
router.post('/customerSave', (request, response) => {
  httpResponse = response;
  var customer = {};
  customer.id = request.body.customerId;
  customer.name = request.body.customerName;
  customer.account = request.body.customerAccount;
  customer.community = request.body.customerCommunity;
  customer.phone = request.body.customerPhone;
  customer.email = request.body.customerEmail;
  customer.notes = request.body.customerNotes;
  console.log(customer);

  if (!validateCustomer(customer)) {
    httpResponse.render('customer/edit', { customer: customer, error: requestError });
    console.log("request to edit customer failed validation!");
    return;
  }
  nextRedirect="customerView?id=" + customer.id;
  customerService.updateCustomer(customer, redirectRequest.bind({ error: requestError, data: requestData }))
});

router.get('/customerView', (request, response) => {
  httpResponse = response;
  var customerId = request.query.id;
  console.log(util.format('%s: Fetching Customer Id: %s', filename, customerId));
  nextView = "customer/view";
  customerService.fetchCustomer(customerId, 'id', renderNextView.bind({ error: requestError, data: requestData }));
});

function sendResponse(error, data) {
  if (error) {
    console.log(error);
    httpResponse.status(501).send(error);
  } else {
    httpResponse.status(201).send(data);
  }
}

function renderNextView(error, data) {
  console.log(util.format('%s: Rendering View: %s', filename, nextView));
  httpResponse.render(nextView, { customer: data[0], error: "" });
}

function redirectRequest(error, data) {
  console.log(util.format('%s: Redirecting to URL: %s', filename, nextRedirect));
  httpResponse.redirect(nextRedirect);
}

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

  if (searchBy == 'name' && utility.hasNumber(searchString)) {
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
    if (!utility.hasValue(customer.id)) {
      requestError = 'No customer id defined. Please contact support.';
      return false;
    }
    if (!utility.hasValue(customer.name)) {
      requestError = 'Name can not be empty.';
      return false;
    }
    if (!utility.hasValue(customer.account)) {
      requestError = 'Account can not be empty.';
      return false;
    }
    if (!utility.hasValue(customer.phone)) {
      requestError = 'Phone can not be empty.';
      return false;
    }
    if (!utility.hasValue(customer.email)) {
      requestError = 'E-mail can not be empty.';
      return false;
    }
    return true;
  }

module.exports = router;
