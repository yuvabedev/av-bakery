var express = require('express');

var util = require('util');

var path = require('path');
var filename = path.basename(__filename);

var router = express.Router();

var customerService = require('../service/CustomerService');
var productService = require('../service/ProductService');
var orderService = require('../service/OrderService');
var callbackHelper = require('./CallbackHelper');

var requestError = {};
var requestData = {};

var defaultOptionForDropDown = '<option value="" selected> Please Select...</option>'

/**
 * handles http request to get a customer with a given id. 
 * The id provided as query param: /customerEdit?id={id}
 * returns the json representing customer object
 */
 router.get('/orderCreate', (request, response) => {
  httpResponse = response;
  var customerId = request.query.customerId;
  console.log(util.format('%s: Creating order for customer id: %s', filename, customerId));

  callbackHelper.setResponse(response);
  callbackHelper.setView("order/create");

  productService.getAllActiveProducts(createActiveProductDropdown.bind({ error: requestError, data: requestData }));
  orderService.getDeliverySchedule(createDeliveryScheduleDropdown.bind({ error: requestError, data: requestData }));
  orderService.getDeliveryLocation(createDeliveryLocationDropdown.bind({ error: requestError, data: requestData }));
  customerService.fetchCustomer(customerId, 'id', callbackHelper.renderNextView.bind({ error: requestError, data: requestData }));
});


function createActiveProductDropdown(error, data) {
 var activeProducts = data;
 var dropDown = '<select class="select-menu" name="breads" id="breads">';
 dropDown = dropDown + defaultOptionForDropDown;
 activeProducts.forEach(function(product) {
   //console.log(product);
   var option = '<option value="%s">%s</option>';
    option = util.format(option, product.name, product.name);
    dropDown = dropDown + option;
 });
 dropDown = dropDown + "</select>";
 httpResponse.locals.activeProductsDropdown  = dropDown;
}

function createDeliveryScheduleDropdown(error, data) {
  var deliverSchedule = data;
  var dropDown = '<select class="select-menu" name="deliverySchedule" id="deliverySchedule">';
  dropDown = dropDown + defaultOptionForDropDown;
  deliverSchedule.forEach(function(schedule) {
    var option = '<option value="%s">%s</option>';
    option = util.format(option, schedule.total_deliveries, schedule.description);
    dropDown = dropDown + option;
  });
  dropDown = dropDown + "</select>";
  httpResponse.locals.deliveryScheduleDropdown  = dropDown;
 }

 function createDeliveryLocationDropdown(error, data) {
  var deliverLocation = data;
  var dropDown = '<select class="select-menu" name="deliveryLocation" id="deliveryLocation">';
  dropDown = dropDown + defaultOptionForDropDown;
  deliverLocation.forEach(function(location) {
    var option = '<option value="%s">%s</option>';
    option = util.format(option, location.name, location.name);
    dropDown = dropDown + option;
  });
  dropDown = dropDown + "</select>";
  httpResponse.locals.deliveryLocationDropdown  = dropDown;
 }


 /**
 * handles http request to get a customer with a given id. 
 * The id provided as query param: /customerEdit?id={id}
 * returns the json representing customer object
 */
  router.post('/orderScheduleSave', (request, response) => {
    httpResponse = response;
    
    var orderSchedule = {};
    orderSchedule.productName= request.body.productName;
    orderSchedule.quantity= request.body.quantity;
    orderSchedule.startDate= request.body.startDate;
    orderSchedule.deliverySchedule= request.body.deliverySchedule;
    orderSchedule.deliveryLocation= request.body.deliveryLocation;

    console.log(orderSchedule);
    
    if (!validateOrderSchedule(orderSchedule)) {
      response.status(400).send(requestError);
      return;      
    }

    //console.log(util.format('%s: Creating order for customer id: %s', filename, customerId));
  
    //callbackHelper.setResponse(response);
    //callbackHelper.setView("order/create");
  
  });

  function validateOrderSchedule(orderSchedule) {
    if (!callbackHelper.hasValue(orderSchedule.productName)) {
      requestError = 'Please select a product from the drop down.';
      return false;
    }
    if (!callbackHelper.hasValue(orderSchedule.quantity)) {
      requestError = 'Please enter quantity.';
      return false;
    }
    if (isNaN(orderSchedule.quantity)) {
      requestError = 'Quantity can only be a number';
      return false;
    }
    if (!callbackHelper.hasValue(orderSchedule.startDate)) {
      requestError = 'Please enter a start date.';
      return false;
    }
    if (!callbackHelper.hasValue(orderSchedule.deliveryLocation)) {
      requestError = 'Please select a delivery location from the drop down.';
      return false;
    }
    if (!callbackHelper.hasValue(orderSchedule.deliverySchedule)) {
      requestError = 'Please select a delivery schedule from the drop down.';
      return false;
    }
    return true;
  }

module.exports = router;