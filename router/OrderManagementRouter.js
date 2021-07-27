var express = require('express');
var moment = require('moment');

var util = require('util');

var path = require('path');
var filename = path.basename(__filename);

var router = express.Router();

var customerService = require('../service/CustomerService');
var productService = require('../service/ProductService');
var orderService = require('../service/OrderService');
var callbackHelper = require('./CallbackHelper');

var DATE_FORMAT = "DD/MM/YYYY";

var requestError = {};
var requestData = {};
var httpResponse = {};

/**
 * handles http request to get a customer with a given id. 
 * The id provided as query param: /customerEdit?id={id}
 * returns the json representing customer object
 */
 router.get('/orderManage', (request, response) => {
    httpResponse = response;
    var customerId = request.query.customerId;
    console.log(util.format('%s: Getting order management for customer id: %s', filename, customerId));
  
    callbackHelper.setResponse(response);
    callbackHelper.setView("order/manage");
  
    customerService.fetchCustomer(customerId, 'id', callbackHelper.renderNextView.bind({ error: requestError, data: requestData }));
  });

  /**
 * handles http request to get a customer with a given id. 
 * The id provided as query param: /customerEdit?id={id}
 * returns the json representing customer object
 */
 router.get('/orderLineItems', (request, response) => {
    httpResponse = response;
    console.log(request.query);
    var customerId = request.query.customerId;
    console.log(util.format('%s: Getting order lines for customer id: %s', filename, customerId));
  
    callbackHelper.setResponse(response);
  
    orderService.getOrderLineItemsByCustomerId(customerId, callbackHelper.sendResponse.bind({ error: requestError, data: requestData }));
  });

  module.exports = router;