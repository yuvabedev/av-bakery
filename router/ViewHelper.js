var util = require('util');
var path = require('path');

var filename = path.basename(__filename);

var defaultOptionForDropDown = '<option value="" selected>Select...</option>';


function createProductCategoryDropdown(jsEvent, jsEventFunction) {
    var productCategories = global.productCategories;
    
    var jsEventTrigger = (jsEvent) ? util.format("%s='%s'", jsEvent, jsEventFunction) : "";

    var dropDown = "<select class='select-menu' name='categories' id='categories' %s>";
    dropDown = util.format(dropDown, jsEventTrigger);

    defaultOptionForDropDown = '<option value="" selected>Select Category...</option>';
    dropDown = dropDown + defaultOptionForDropDown;
    productCategories.forEach(function(category) {
     var option = '<option value="%s">%s</option>';
      option = util.format(option, category.id, category.name);
      dropDown = dropDown + option;
   });
   dropDown = dropDown + "</select>";
   return dropDown;   
  }

  function createDeliveryLocationDropdown() {
    var deliverLocations = global.deliveryLocations;
    var dropDown = '<select class="select-menu" name="deliveryLocation" id="deliveryLocation">';
    dropDown = dropDown + defaultOptionForDropDown;
    deliverLocations.forEach(function(location) {
      var option = '<option value="%s">%s</option>';
      option = util.format(option, location.name, location.name);
      dropDown = dropDown + option;
    });
    dropDown = dropDown + "</select>";
    return dropDown;
   }

  module.exports = {
    createProductCategoryDropdown,
    createDeliveryLocationDropdown,
  };