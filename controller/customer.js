var express = require('express');

var path = require('path');
var filename = path.basename(__filename);

var router = express.Router();

var customerService = require('../service/CustomerService');
var utility = require('./Utility');

var httpResponse = {};
var requestError = {};

router.post('/searchCustomers', (request, response) => {
  if (!validateRequest(request)) {
    response.status(400).send(requestError);
    return;
  }
  var requestJson = request.body;
  var searchBy = requestJson.searchBy;
  var searchString = requestJson.searchQuery;
  httpResponse = response;

  var error = {};
  var data = {};

  customerService.searchCustomer(
    searchString,
    searchBy,
    prepareDataForView.bind({ error: error, data: data })
  );
});

function prepareDataForView(error, data) {
  if (error) {
    console.log(error);
    httpResponse.status(501).send(error);
  } else {
    //console.log(data);
    httpResponse.status(201).send(data);
  }
}

function validateRequest(request) {
  var requestJson = request.body;
  var searchBy = requestJson.searchBy;
  var searchString = requestJson.searchQuery;
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
module.exports = router;
