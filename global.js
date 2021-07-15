var productService = require('./service/ProductService');
var orderService = require('./service/OrderService');

productService.getAllActiveProducts(setGlobalActiveProducts.bind({ error: requestError, data: requestData }));
orderService.getDeliveryLocation(setGlobalDeliveryLocations.bind({ error: requestError, data: requestData }));
orderService.getDeliverySchedule(setGlobalDeliverySchedule.bind({ error: requestError, data: requestData }));


var requestError = {};
var requestData = {};

function setGlobalActiveProducts(error, data) {
    var activeProducts = [];
    data.forEach(function(product) {
        activeProducts.push(product);
    });
    global.activeProducts = activeProducts;
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