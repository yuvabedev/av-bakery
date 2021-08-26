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
    var criteriaDate = request.query.date;
    var reportName = request.query.reportName;
    console.log(util.format('Executing report: %s for date %s', reportName, criteriaDate));
    callbackHelper.setResponse(response);

    var reportData = {};
    switch(reportName) {
        case "product_quantity_grouped_by_date":
            reportsService.getProductsAndQuantityGroupedByDate(criteriaDate, callbackHelper.sendResponse.bind({ error: requestError, data: requestData }));
            break;
        default:
            break;
    }
});
module.exports = router;