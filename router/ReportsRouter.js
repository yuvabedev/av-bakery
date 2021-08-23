var express = require('express');

var util = require('util');

var path = require('path');
var filename = path.basename(__filename);

var router = express.Router();

var reportsService = require('../service/ReportsService');
var callbackHelper = require('./CallbackHelper');

var requestError = {};
var requestData = {};



router.get('/reportList', (request, response) => {
    response.render('reports/list')
});


router.get('/reportView', (request, response) => {
    response.render('reports/view')
});

router.get('/reportRun', (request, response) => {
    var criteriaDate = request.query.criteriaDate;
    var reportData = reportsService.getProductsAndQuantityGroupedByDate(criteriaDate);
    response.render('reports/view');
});
module.exports = router;