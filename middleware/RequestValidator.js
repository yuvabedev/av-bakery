var express = require('express');
var customerService = require('../service/CustomerService');

var httpNext;
var httpRequest;
var httpResponse;

var validateQueryStringForCustomerId = function (request, response, next) {

    var url = request.url;
    httpRequest = request;
    httpNext = next;
    httpResponse = response;

    //if the URL needs validation for customer id  - please do so
    if (shallValidateUrlForCustomerId(url)) {
      if (isQueryStringValidWithCustomerId(request)) {
        validateCustomerId(request);
      } else {
        console.log("URL Failed Validation:" + url + " Rendering 404");
        response.render("404");
      }
    } else {
      httpNext();
    }
  }

  function isQueryStringValidWithCustomerId(request) {
    var queryStringObject = request.query;
    console.log("Query String Keys:" + Object.keys(queryStringObject));

    //There are no query strings  - return false
    if (Object.keys(queryStringObject).length < 1) return false;

    var queryStrings = Object.keys(queryStringObject);
    //query string does not has a customerId 
    if (queryStrings.indexOf("customerId") < 0) return false;

    var customerId = queryStringObject["customerId"];
    if (customerId == null || customerId.length < 1) return false;

    return true;
  }

  function validateCustomerId(request) {
    var customerId = request.query.customerId;

    var requestError = {};
    var requestData = {};

    customerService.fetchCustomer(customerId, 'id', send404IfCustomerIdIsInvalid.bind({ requestError, requestData }));
  }

  function send404IfCustomerIdIsInvalid(error, results) {

    if (results.length <1 ) {
      console.log("Rendering 404. Not valid customer id: " + httpRequest.query.customerId);
      httpResponse.render("404");
    } else {
      httpNext();
    }
  }

  function shallValidateUrlForCustomerId(url) {
    if ( (url.indexOf("orderCreate") !== -1) || (url.indexOf("orderManage") !== -1) ) return true;
    return false;
  }

  module.exports = {
    validateQueryStringForCustomerId,
  };