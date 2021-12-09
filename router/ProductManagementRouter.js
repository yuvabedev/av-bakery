var express = require('express');
var router = express.Router();
var util = require('util');
var path = require('path');

var callbackHelper = require('./CallbackHelper');

var requestError = {};
var requestData = {};

var filename = path.basename(__filename);

var httpRequest = null;
var httpResponse = null;



/**
 * handles http request to create a product
 * On success viewEditProduct page is loaded
 */
 router.get('/productCreate', (request, response) => {
    console.log("Loading product/create");

    callbackHelper.setResponse(response);
    callbackHelper.setView("product/create");
  
    callbackHelper.renderNextView(requestError, requestData);

});

/**
 * handles http request to create a product
 * On success viewEditProduct page is loaded
 */
 router.post('/productCreate', (request, response) => {
  console.log("Creating a new product");
  console.log(request.body);
  callbackHelper.setResponse(response);
  httpRequest = request;
  httpResponse = response;

  var product = {};
  
  product.name = request.body.product_name;
  product.category = request.body.category;
  product.ingredients = request.body.ingredients;
  product.image_url = request.body.image_url;
  product.is_vegan = request.body.is_vegan;
  product.is_dairyfree = request.body.is_dairyfree;
  product.is_eggless = request.body.is_eggless;

  //save product
});


module.exports = router;