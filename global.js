var productService = require('./service/ProductService');
var orderService = require('./service/OrderService');

productService.getAllProductCategories(setGlobalProductCategories.bind({ error: requestError, data: requestData }));
orderService.getDeliveryLocation(setGlobalDeliveryLocations.bind({ error: requestError, data: requestData }));
orderService.getDeliverySchedule(setGlobalDeliverySchedule.bind({ error: requestError, data: requestData }));


var requestError = {};
var requestData = {};

function setGlobalProductCategories(error, data) {
    var productCategories = [];
    data.forEach(function(category) {
        productCategories.push(category);
    });
    global.productCategories = productCategories;
}

function setGlobalDeliveryLocations(error, data) {
    var deliveryLocations = [];
    data.forEach(function(deliveryLocation) {
        deliveryLocations.push(deliveryLocation);
    });
    global.deliveryLocations = deliveryLocations;
}

function setGlobalDeliverySchedule(error, data) {
    var deliverySchedule = [];
    data.forEach(function(schedule) {
        deliverySchedule.push(schedule);
    });
    global.deliverySchedule = deliverySchedule;
}