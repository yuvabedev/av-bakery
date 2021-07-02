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
  customerService.fetchCustomer(customerId, 'id', callbackHelper.renderNextView.bind({ error: requestError, data: requestData }));
});


function createActiveProductDropdown(error, data) {
 var activeProducts = data;
 var dropDown = '<select class="select-menu" name="breads" id="breads">';
 activeProducts.forEach(function(product) {
   //console.log(product);
   var option = '<option value="%s">%s</option>';
    option = util.format(option, product.id, product.name);
    dropDown = dropDown + option;
 });
 dropDown = dropDown + "</select>";
 httpResponse.locals.activeProductsDropdown  = dropDown;
 console.log(dropDown);
}

module.exports = router;