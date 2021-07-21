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

  createActiveProductDropdown(null);
  createDeliveryScheduleDropdown(null);
  createDeliveryLocationDropdown(null);
  customerService.fetchCustomer(customerId, 'id', callbackHelper.renderNextView.bind({ error: requestError, data: requestData }));
});


function createActiveProductDropdown(selectedProduct) {
  var activeProducts = global.activeProducts;
 var dropDown = '<select class="select-menu" name="breads" id="breads">';
 dropDown = dropDown + defaultOptionForDropDown;
 activeProducts.forEach(function(product) {
   var option = '<option value="%s">%s</option>';
    option = util.format(option, product.name, product.name);
    dropDown = dropDown + option;
 });
 dropDown = dropDown + "</select>";
 httpResponse.locals.activeProductsDropdown  = dropDown;
}

function createDeliveryScheduleDropdown(error, data) {
  var deliverySchedule = global.deliverySchedule;
  var dropDown = '<select class="select-menu" name="deliverySchedule" id="deliverySchedule">';
  dropDown = dropDown + defaultOptionForDropDown;
  deliverySchedule.forEach(function(schedule) {
    var option = '<option value="%s">%s</option>';
    option = util.format(option, schedule.total_deliveries, schedule.description);
    dropDown = dropDown + option;
  });
  dropDown = dropDown + "</select>";
  httpResponse.locals.deliveryScheduleDropdown  = dropDown;
 }

 function createDeliveryLocationDropdown(selectedLocation) {
  var deliverLocations = global.deliveryLocations;
  var dropDown = '<select class="select-menu" name="deliveryLocation" id="deliveryLocation">';
  dropDown = dropDown + defaultOptionForDropDown;
  deliverLocations.forEach(function(location) {
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
  router.post('/orderLineItemsGenerate', (request, response) => {
    httpResponse = response;
    
    var orderSchedule = {};
    orderSchedule.productName= request.body.productName;
    orderSchedule.quantity= request.body.quantity;
    orderSchedule.startDate= request.body.startDate;
    orderSchedule.deliverySchedule= request.body.deliverySchedule;
    orderSchedule.deliveryLocation= request.body.deliveryLocation;

    if (!validateOrderSchedule(orderSchedule)) {
      response.status(400).send(requestError);
      return;      
    }

    var orderLineItems = generateOrderLineItems(orderSchedule);
    var orderLineItemsUL = convertLineItemsToHTML(orderLineItems);
    response.status(201).send(orderLineItemsUL);  
  });

  function validateOrderSchedule(orderSchedule) {
    if (!callbackHelper.hasValue(orderSchedule.productName)) {
      requestError = 'Please select product from the drop down.';
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
      requestError = 'Please enter delivery start date.';
      return false;
    }
    if (!moment(orderSchedule.startDate, DATE_FORMAT).isValid()) {
      requestError = 'Delivery start date is not valid. It must be in the format dd/mm/yyyy';
      return false;
    }

    var deliveryDate  = moment(orderSchedule.startDate, DATE_FORMAT);

    if (!deliveryDate.isAfter()) {
      requestError = 'Delivery start date must be a future date';
      return false;
    }

    if (!callbackHelper.hasValue(orderSchedule.deliveryLocation)) {
      requestError = 'Please select delivery location from the drop down.';
      return false;
    }
    if (!callbackHelper.hasValue(orderSchedule.deliverySchedule)) {
      requestError = 'Please select delivery schedule from the drop down.';
      return false;
    }
    return true;
  }

 /**
  * Using order schedule creates an array of line items for the schedule
  * The number of line items = orderSchedule.deliverySchedule
  * @param {*} orderSchedule 
  * @returns 
  */
  function generateOrderLineItems(orderSchedule) {
    var totalDeliveries = Number(orderSchedule.deliverySchedule);
    var orderLineItems = [];
    for (var currentDelivery = 0 ; currentDelivery <totalDeliveries; currentDelivery++) {
      var orderLineItem = {};
      orderLineItem.productName = orderSchedule.productName;
      orderLineItem.quantity = orderSchedule.quantity;
      var numDaysToAdd = currentDelivery * 7;
      var nextDeliveryDate = moment(orderSchedule.startDate, DATE_FORMAT).add(numDaysToAdd, 'days').format(DATE_FORMAT);
      orderLineItem.deliveryDate = nextDeliveryDate;
      orderLineItem.deliveryLocation = orderSchedule.deliveryLocation;
      orderLineItems.push(orderLineItem);
    }
    return orderLineItems;
 }

 function convertLineItemsToHTML(orderLineItems) {
   var orderLineItemsUL = "";
   var productNameLi = "<li style='display:inline' class='orderLineItem'>%s</li>";
   //var quantityLI = "<li style='display:inline'><input type='text' name='quantity' id='quantity' class='text-input' value='%s' /></li>";
   var quantityLI = "<li style='display:inline' class='orderLineItem'>%s</li>";
   var deliveryDateLI = "<li style='display:inline' class='orderLineItem'>%s</li>";
   var deliveryLocationLI = "<li style='display:inline' class='orderLineItem'>%s</li>";
   var deleteOrderLineItemButtonLi = "<li style='display:inline; margin-left: 20px;'><button onClick='javascript:removeOrderLineItem(this)' class='customer-button'>Remove</button></li>";
   orderLineItems.forEach(function(orderLineItem) {
     console.log("Generating UL for Order Line Item:");
     console.log(orderLineItem);
     var orderLineItemUL = "<ul class='orderLineItems'>%s</ul>";
     var itemsList = "";
     itemsList += util.format(productNameLi, orderLineItem.productName);
     itemsList += util.format(quantityLI, orderLineItem.quantity);
     itemsList += util.format(deliveryDateLI, orderLineItem.deliveryDate);
     itemsList += util.format(deliveryLocationLI, orderLineItem.deliveryLocation);
     itemsList += deleteOrderLineItemButtonLi;
     orderLineItemUL = util.format(orderLineItemUL, itemsList);
     console.log("UL Generated:" + orderLineItemUL);
     orderLineItemsUL += orderLineItemUL;
   });
   return orderLineItemsUL;
 }
module.exports = router;