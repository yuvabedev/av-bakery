$('#manageCustomerOrderButton').click(function () {
  var customerId = $("input[name='customerId']:checked").val();
  if (customerId == undefined) {
    $('#editMessage').html('Please select a customer').addClass('error');
    return;
  }
  manageCustomerOrder(customerId);
});

function manageCustomerOrder(customerId) {
  console.log("Creating order for customerID : " + customerId);
  if (customerId == undefined) {
    $('#editMessage').html('Please select a customer to create order').addClass('error');
    return;
  }    
  window.location.href = `/orderManage?customerId=${customerId}`;
}

$('#createCustomerOrderButton').click(function () {
    var customerId = $("#customerId").val();
    if (customerId == undefined) {
      console.log("No customer id available on page");
      return;
    }
    createCustomerOrder(customerId);
  });

function createCustomerOrder(customerId) {
    console.log("Creating order for customerID : " + customerId);
    if (customerId == undefined) {
      $('#editMessage').html('Please select a customer to create order').addClass('error');
      return;
    }    
    window.location.href = `/orderCreate?customerId=${customerId}`;
}


$('#generateOrderLineItems').click(function () {
  $('#saveMessage').html('').removeClass('error warning success');
  var orderLineItems = $(".orderLineItems");
  console.log("removing existing order line items....");
  orderLineItems.remove();

  console.log("Creating new order schedule....");
  var orderSchedule = getOrderSchedule();
  generateOrderLines(orderSchedule);
});

function getOrderSchedule() {
  orderSchedule = {};
  orderSchedule.customerId =  $('#customerId').val();
  orderSchedule.productName = $('#items').find(":selected").text()
  orderSchedule.productId = $('#items').find(":selected").val();
  orderSchedule.quantity =  $('#quantity').find(":selected").val();
  orderSchedule.startDate = $('#startDate').val();
  var orderType = $("input[name='orderType']:checked").val();
  orderSchedule.orderType = orderType;
  orderSchedule.deliveryLocation = $('#deliveryLocation').find(":selected").val();
  return orderSchedule;
}

function generateOrderLines(orderSchedule) {
  console.log("Generating line items from order schedule...");
  $.post('orderLineItemsGenerate', orderSchedule)
    .done(function (data) {
      console.log('Order Line Items generated...');
      appendLineItemsToOrderSchedule(data);
    })
    .fail(function (e) {
      console.log(e);
      if (e.status == 400) {
        displayError(e.responseText, "#saveMessage");
      }
    });
}

function appendLineItemsToOrderSchedule(orderLineItemsUL) {
      var orderLineItemsDiv = $("#orderLineItems");
      $(orderLineItemsUL).prependTo(orderLineItemsDiv);
      orderLineItemsDiv.show();
}

function removeOrderLineItem(currentElement) {
    var ulElement = $(currentElement).closest('ul');
    ulElement.remove();
}

$("#confirmOrderSchedule").click(function() {
  var orderSchedule = getOrderSchedule();

  //While saving order schedule, total deliveries are being fetched from order line items as user might have deleted few deliveries.
  var totalDeliveries = $('#orderLineItems').children('ul').length;
  orderSchedule.totalDeliveries = totalDeliveries;

  saveOrderSchedule(orderSchedule);
});

/**
 * Makes the ajax calls to save order schedule. The success callback makes the ajax call to save line items
 * @param {*} orderSchedule 
 */
function saveOrderSchedule(orderSchedule) {
  console.log("Saving order schedule...");
  $.post('orderScheduleSave', orderSchedule)
    .done(function (data) {
      console.log('Order Schedule Saved With id: '  + data[0].id);
      saveOrderLineItems(data[0]);
    })
    .fail(function (e) {
      console.log(e);
      if (e.status == 400) {
        displayError(e.responseText, "#saveMessage");
      }
    });
}

/**
 * Makes the ajax call to save order line items
 * @param {*} savedOrderSchedule 
 */
function saveOrderLineItems(savedOrderSchedule) {
     var orderLineItems = generateOrderLineItemsFromUI(savedOrderSchedule);
     $.post('orderLineItemsSave', {"orderLineItems":JSON.stringify(orderLineItems)})
     .done(function(data) {
      console.log('Total order line items saved: '  + data.changedRows);
      loadOrderManagement(savedOrderSchedule.customer_id);
     })
     .fail(function (error) {
         console.log(error);
     });
 }

 function loadOrderManagement(customerId) {
    window.location.href = `/orderManage?customerId=${customerId}`;
 }

function generateOrderLineItemsFromUI(orderSchedule) {
  var orderLineItems = [];
  $('#orderLineItems').children('ul').each(function () {  
    var orderLineItemAttributes = this.children;
    var productName = orderLineItemAttributes[0].textContent;
    var productId = orderSchedule.product_id;
    var quantity = orderLineItemAttributes[1].textContent;
    var deliveryDate = orderLineItemAttributes[2].textContent;
    var deliveryLocation = orderLineItemAttributes[3].textContent;
    var orderScheduleId = orderSchedule.id;
    var customerId = orderSchedule.customer_id;
    var orderLineItem = {"orderScheduleId": orderScheduleId, "customerId": customerId, "productName" : productName, "productId": productId, "quantity": quantity, 
                    "deliveryDate" : deliveryDate, "deliveryLocation": deliveryLocation};
    orderLineItems.push(orderLineItem);
  });
  return orderLineItems;
}

/**
 * This function is called from create.ejs when a category is changed from the category dropdown
 * @param {} currentElement 
 * @returns 
 */
function updateProductDropdown(currentElement) {
  var categoryId = currentElement.value;
  if (categoryId == null || categoryId.trim().length < 1) {
    console.log("No category selected. Product dropdown not updated");
    replaceProductDrowpdownWithDefault();
    return;
  }
  var criteria = {};
  criteria.categoryId = categoryId;
  console.log("Fetching product data for category id " + categoryId);
  $.get('productsByCategory', criteria)
  .done(function (data) {
    console.log('Products fetched for category ' + categoryId);
    replaceProductDrowpdown(data);
  })
  .fail(function (e) {
    console.log(e);
    if (e.status == 400) {
      displayError(e.responseText, "#searchMessage");
    }
  });
}

function replaceProductDrowpdown(products) {
  var dropDownMenu = '<select class="select-menu" name="items" id="items">';
  var defaultOptionForDropDown = '<option value="" selected>Select Item...</option>';
  dropDownMenu += defaultOptionForDropDown;
  products.forEach(function(product) {
    var selectOption = `<option value="${product.id}">${product.name}</option>`;
    dropDownMenu += selectOption;
  });
  dropDownMenu += "</select>";
  $("#productSelectMenu").html(dropDownMenu);
}

function replaceProductDrowpdownWithDefault() {
  var defaultOptionForDropDown = '<option value="" selected> Select Item...</option>'
  var dropDownMenu = '<select class="select-menu" name="items" id="items">';
  dropDownMenu += defaultOptionForDropDown;
  dropDownMenu += "</select>";
  $("#productSelectMenu").html(dropDownMenu);
}
/**
 * This function generates quantity dropdown with values from 1 to maxDropdownQuantity
 * This function is called from create.ejs 
 */
function generateQuantityDropdown() {
  var maxDropdownQuantity = 10;
  var defaultOptionForDropDown = '<option value="" selected> Select Quantity...</option>';
  var dropDownMenu = '<select class="select-menu" name="quantity" id="quantity">';
  dropDownMenu += defaultOptionForDropDown;
  var drowDownOption;
  for (drowDownOption = 1; drowDownOption <= maxDropdownQuantity;  drowDownOption++) {
    var selectOption = `<option value="${drowDownOption}">${drowDownOption}</option>`;
    dropDownMenu += selectOption;
  }
  dropDownMenu += "</select>";
  $("#quantitySelectMenu").html(dropDownMenu);
}

function updateOrderType(currentElement) {
  var orderType = currentElement.value;
  console.log("Order Type: " + orderType);
  switch(orderType) {
    case "onetime" : {
      updateScreenForOneTimeOrderType();
      break;
    }
    case "regular" : {
      updateScreenForRegularOrderType();
      break;
    }
  }
}

function updateScreenForRegularOrderType() {
  $("#labelDeliveryDate").hide();
  $("#labelOrderStartDate").show();
  $("#labelOrderDeliveryDays").show();
  $("#orderDeliveryDays").css("display", "inline");
  $(".select2-container").show();
}

function updateScreenForOneTimeOrderType() {
  $("#labelDeliveryDate").show();
  $("#labelOrderStartDate").hide();
  $("#labelOrderDeliveryDays").hide();  
  $("#orderDeliveryDays").hide();  
  $(".select2-container").hide();
}