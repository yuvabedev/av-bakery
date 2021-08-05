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
    console.log("Fetching order line items with criteria " + JSON.stringify(request.query));
    
    var customerId = request.query.customerId;
    var startDate = request.query.startDate;
    var endDate = request.query.endDate;
  
    var criteria = {};
    criteria.customerId = customerId;
    criteria.startDate = startDate;
    criteria.endDate = endDate;

    callbackHelper.setResponse(response);
    orderService.getOrderLineItemsByCustomerIdAndDateRange(criteria, callbackHelper.sendResponse.bind({ error: requestError, data: requestData }));
  });

  router.get ('/deliveryLocations' , (request, response) => {
    var deliverLocations = global.deliveryLocations;
    response.status(201).send(deliverLocations);
  });

  /**
   * Updates the order line item received from request
   */
  router.put('/orderLineItemUpdate', (request, response) => {
    callbackHelper.setResponse(response);

    console.log("Updating order line item:" + JSON.stringify(request.body));

    if (!validateOrderLineItemForUpdate(request.body)) {
      console.log("Request to edit order line item failed validation!");
      response.status(400).send(requestError);
      return;
    }
    
    var orderLineItem = {};
    orderLineItem.id = request.body.id;
    orderLineItem.quantity = request.body.quantity;
    orderLineItem.deliveryLocation = request.body.deliveryLocation;

    orderService.updateOrderLineItem(orderLineItem, callbackHelper.sendResponse.bind({ error: requestError, data: requestData }));
  });

    /**
   * Updates the order line item received from request
   */
     router.put('/orderLineItemDelete', (request, response) => {
      callbackHelper.setResponse(response);  
      console.log("Deleted order line item:" + request.body.id);
      var orderLineItemId = request.body.id;
      orderService.disableOrderLineItem(orderLineItemId, callbackHelper.sendResponse.bind({ error: requestError, data: requestData }));
    });

  function validateOrderLineItemForUpdate(requestData) {
    if (!callbackHelper.hasValue(requestData.id)) {
      requestError = 'No orderLine id defined. Please contact support.';
      return false;
    }
    if (callbackHelper.hasValue(requestData.quantity)) {
      if (isNaN(requestData.quantity)) {
        requestError = 'Quantity must be a number.';
        return false;
      }
    }
    if (Number(requestData.quantity) < 1) {
      requestError = 'Quantity must be 1 or greater.';
      return false;
    }
    return true;
  }

  module.exports = router;