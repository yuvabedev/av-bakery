var express = require('express');

var util = require('util');

var path = require('path');
var filename = path.basename(__filename);

var router = express.Router();

var customerService = require('../service/OrderService');
var helper = require('./CallbackHelper');

var httpResponse = {};
var requestError = {};
var requestData = {};


/**
 * handles http request to get a customer with a given id. 
 * The id provided as query param: /customerEdit?id={id}
 * returns the json representing customer object
 */
 router.get('/orderCreate', (request, response) => {
  httpResponse = response;
  var customerId = request.query.customerId;
  console.log(util.format('%s: Fetching Customer Id: %s', filename, customerId));
  
  helper.nextView = "order/create";
  customerService.fetchCustomer(customerId, 'id', helper.renderNextView.bind({ error: requestError, data: requestData }));
});


module.exports = router;