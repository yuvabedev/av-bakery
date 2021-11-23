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

var DATE_FORMAT_ORDER_LINE_ITEM = "MMM Do, YYYY (ddd)";

var requestError = {};
var requestData = {};
var httpResponse = {};

var defaultOptionForDropDown = '<option value="" selected>Select...</option>';

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

  createProductCategoryDropdown(null);
  createDeliveryScheduleDropdown(null);
  createDeliveryLocationDropdown(null);
  customerService.fetchCustomer(customerId, 'id', callbackHelper.renderNextView.bind({ error: requestError, data: requestData }));
});


router.get('/productsByCategory', (request, response) => {
  var categoryId = request.query.categoryId;
  callbackHelper.setResponse(response);
  productService.getProductsByCategoryId(categoryId, callbackHelper.sendResponse.bind({requestError, requestData}));
});


function createProductCategoryDropdown(selectedCategory) {
  var productCategories = global.productCategories;
  var dropDown = '<select class="select-menu" name="categories" id="categories" onChange="updateProductDropdown(this)">';
  defaultOptionForDropDown = '<option value="" selected>Select Category...</option>';
  dropDown = dropDown + defaultOptionForDropDown;
  productCategories.forEach(function(category) {
   var option = '<option value="%s">%s</option>';
    option = util.format(option, category.id, category.name);
    dropDown = dropDown + option;
 });
 dropDown = dropDown + "</select>";
 httpResponse.locals.categoriesDropdown  = dropDown;
 httpResponse.locals.productCategories  = productCategories;
}

function createDeliveryScheduleDropdown(error, data) {
  var deliverySchedule = global.deliverySchedule;
  var dropDown = '<select class="select-menu" name="deliverySchedule" id="deliverySchedule">';
  defaultOptionForDropDown = '<option value="" selected>Select Location...</option>';
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
     * Handles the HTTP request for generating the order line items from order schedule.
     * The order schedule is posted as a JSON object.
     * Order line items are returned as JSON array.
     */  
    router.post('/orderLineItemsGenerate', (request, response) => {
    var orderSchedule = {};
    orderSchedule.productName= request.body.productName;
    orderSchedule.quantity= request.body.quantity;
    orderSchedule.startDate= request.body.startDate;
    orderSchedule.orderType= request.body.orderType;
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
    if (!callbackHelper.hasValue(orderSchedule.productName) || orderSchedule.productName.includes("Category")
                                                            || orderSchedule.productName.includes("Item") ) {
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
    return true;
  }

 /**
  * Using order schedule creates an array of order line items.
  * If the orderType is one time then only 1 order line item is generated.
  * If the ordertype is regular then order line items for 12 weeks are generated.
  * For regular type order the total number of order line items are 12 X number of days in the week for which the delivery is requested.
  * @param {*} orderSchedule 
  * @returns 
  */
  function generateOrderLineItems(orderSchedule) {

    console.log("orderSchedule.orderType:" + orderSchedule.orderType);
    var orderLineItems = [];

    if (orderSchedule.orderType == "onetime") {
      orderLineItems = generateOrderLineItemForOneTimeDelivery(orderSchedule);
    } else {
      orderLineItems = generateOrderLineItemForRegularDelivery(orderSchedule);
    }
    return orderLineItems;
 }

  function generateOrderLineItemForOneTimeDelivery(orderSchedule) {
    var orderLineItem = {};
    orderLineItem.productName = orderSchedule.productName;
    orderLineItem.quantity = orderSchedule.quantity;
    var nextDeliveryDate = moment(orderSchedule.startDate, DATE_FORMAT).format(DATE_FORMAT_ORDER_LINE_ITEM);
    orderLineItem.deliveryDate = nextDeliveryDate;
    orderLineItem.deliveryLocation = orderSchedule.deliveryLocation;

    var orderLineItems = [];
    orderLineItems.push(orderLineItem);
    return orderLineItems;
  }

  function generateOrderLineItemForRegularDelivery(orderSchedule) {
    var deliveryWeeks = 12;
    var currentDeliveryWeek = 0;
    var orderLineItems = [];

    for (currentDeliveryWeek = 0 ; currentDeliveryWeek < deliveryWeeks; currentDeliveryWeek++) {
      var orderLineItem = {};
      orderLineItem.productName = orderSchedule.productName;
      orderLineItem.quantity = orderSchedule.quantity;
      var numDaysToAdd = currentDeliveryWeek * 7;
      var nextDeliveryDate = moment(orderSchedule.startDate, DATE_FORMAT).add(numDaysToAdd, 'days').format(DATE_FORMAT_ORDER_LINE_ITEM);
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
     var orderLineItemUL = "<ul class='orderLineItems'>%s</ul>";
     var itemsList = "";
     itemsList += util.format(productNameLi, orderLineItem.productName);
     itemsList += util.format(quantityLI, orderLineItem.quantity);
     itemsList += util.format(deliveryDateLI, orderLineItem.deliveryDate);
     itemsList += util.format(deliveryLocationLI, orderLineItem.deliveryLocation);
     itemsList += deleteOrderLineItemButtonLi;
     orderLineItemUL = util.format(orderLineItemUL, itemsList);
     //console.log("UL Generated:" + orderLineItemUL);
     orderLineItemsUL += orderLineItemUL;
   });
   return orderLineItemsUL;
 }
    /**
     * Handles the HTTP request for saving the order schedule. 
     * Order Schedule is posted as JSON
     */
     router.post('/orderScheduleSave', (request, response) => {
    callbackHelper.setResponse(response);
    console.log("saving order schedule...");
    var orderSchedule = {};
    orderSchedule.customerId= request.body.customerId;
    orderSchedule.productId= request.body.productId;
    orderSchedule.productName= request.body.productName;
    orderSchedule.quantity= request.body.quantity;
    orderSchedule.startDate = moment(request.body.startDate, DATE_FORMAT).format('YYYY-MM-DD');;
    orderSchedule.totalDeliveries= request.body.totalDeliveries;
    orderSchedule.deliveryLocation= request.body.deliveryLocation;
    orderSchedule.notes = callbackHelper.convertToEmptyIfUndefined(request.body.notes);
    orderSchedule.status = 'ACTIVE';
    orderService.saveOrderSchedule(orderSchedule, callbackHelper.sendResponse.bind({ error: requestError, data: requestData }))
  });

    /**
     * Handles the HTTP request for saving the order line items. 
     * Order line items are posted as JSON array
     */
    router.post('/orderLineItemsSave', (request, response) => {
      callbackHelper.setResponse(response);
      console.log("saving order line items...");
      var orderLineItems = JSON.parse(request.body.orderLineItems);
      saveOrderLineItems(orderLineItems);
      
      var scheduleId = orderLineItems[0].scheduleId;
      response.status(201).send("data");
    });

    function saveOrderLineItems(orderLineItems) {
      orderLineItems.forEach(function(orderLineItem) {
        orderLineItem.notes = callbackHelper.convertToEmptyIfUndefined(orderLineItem.notes);
        orderLineItem.deliveryDate = moment(orderLineItem.deliveryDate, DATE_FORMAT).format('YYYY-MM-DD');
        orderLineItem.status = 'ACTIVE';
        orderService.saveOrderLineItem(orderLineItem, callbackHelper.logSavedObject.bind({ error: requestError, data: requestData }));
      });
    }

module.exports = router;