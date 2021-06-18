var express = require('express');

var router = express.Router();

var customerService = require('../service/CustomerService');

var httpResponse = {};

router.post('/searchCustomers', (request, response) => {
  var requestJson = request.body;
  var searchBy = requestJson.searchBy;
  var searchString = requestJson.searchQuery;
  httpResponse = response;

  var error = {};
  var data = {};

  if (searchBy == 'searchByName') {
    customerService.searchCustomerByName(
      searchString,
      prepareDataForView.bind({ error: error, data: data })
    );
  } else if (searchBy == 'searchByAccount') {
    customerService.searchCustomerByAccount(
      searchString,
      prepareDataForView.bind({ error: error, data: data })
    );
  } else {
    response.status(400).send('Search By is not valid.');
  }
});

function prepareDataForView(error, data) {
  if (error) {
    console.log(error);
    httpResponse.status(501).send(error);
  } else {
    console.log(data);
    httpResponse.status(201).send(data);
  }
}

module.exports = router;
