$('#createCustomerOrderButton').click(function () {
    var customerId = $("input[name='customerId']:checked").val();
    if (customerId == undefined) {
      $('#editMessage').html('Please select a customer to create order').addClass('error');
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
  orderSchedule.productName = $('#breads').find(":selected").text()
  orderSchedule.productId = $('#breads').find(":selected").val();
  orderSchedule.quantity =  $('#quantity').val();
  orderSchedule.startDate = $('#startDate').val();
  orderSchedule.deliverySchedule = $('#deliverySchedule').find(":selected").val();
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

function saveOrderSchedule(orderSchedule) {
  console.log("Saving order schedule...");
  $.post('orderScheduleSave', orderSchedule)
    .done(function (data) {
      console.log('Order Schedule Saved With id: '  + data.id);
      saveOrderLineItems(data[0]);
    })
    .fail(function (e) {
      console.log(e);
      if (e.status == 400) {
        displayError(e.responseText, "#saveMessage");
      }
    });
}

function saveOrderLineItems(savedOrderSchedule) {
     var orderLineItems = getOrderLineItems(savedOrderSchedule);
     $.post('orderLineItemsSave', {"orderLineItems":JSON.stringify(orderLineItems)})
     .done(function(data) {
      console.log('Total order line items saved: '  + data.changedRows);
      displayOrderManagement(savedOrderSchedule.customer_id);
     })
     .fail(function (error) {
         console.log(error);
     });
 }

 function displayOrderManagement(customerId) {
    window.location.href = `/orderManage?customerId=${customerId}`;
 }
function getOrderLineItems(orderSchedule) {
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
  console.log(orderLineItems);
  return orderLineItems;
}

function loadOrderLineItemsForCustomerId(customerId) {
  console.log ("getting order line items for customer id : " + customerId);
  var criteria = {"customerId": customerId};
  console.log(criteria);
  $.get('orderLineItems', criteria)
  .done(function (data) {
    console.log('Request Success!!');
    console.log(data);
    displayOrderLines(data);
  })
  .fail(function (e) {
    console.log(e);
    if (e.status == 400) {
      displayError(e.responseText, "#searchMessage");
    }
  });
}

function displayOrderLines(orderLines) {
  if (orderLines.length < 1) {
    $('#loadMessage').html('No Orders Found').addClass('warning');
  } else {
    $('#loadMessage').html(`${orderLines.length} Orders Found`).addClass('success');
  }

  var orderLineItemsList = "";

  for (index in orderLines) {
    var orderLine = orderLines[index];
    var orderLineLI = "";
    var productNameLI = `<li style='display:inline' class='orderLineItem'>${orderLine.product_name}</li>`;
    var quantityLI = `<li style='display:inline' class='orderLineItem'>${orderLine.quantity}</li>`;
    var formattedDate = formatDateString(orderLine.delivery_date);
    var deliveryDateLI = `<li style='display:inline' class='orderLineItem'>${formattedDate}</li>`;
    var deliveryLocationLI = `<li style='display:inline' class='orderLineItem'>${orderLine.delivery_location}</li>`;
    var editOrderLineItemButtonLi = "<li style='display:inline-block; width=100px;' class='orderlineitem-edit'><button onClick='javascript:makeLineItemEditable(this)' class='customer-button'>Edit</button></li>";
    var editCancelOrderLineItemButtonLi = "<li style='display:none; width=100px;' class='orderlineitem-cancel-edit'><button onClick='javascript:cancelEditLineItem(this)' class='customer-button'>Cancel</button></li>";
    var deleteOrderLineItemButtonLi = "<li style='display:inline; margin-left: 20px;'><button onClick='javascript:deleteLineItem(this)' class='customer-button'>Delete</button></li>";
    var orderLineLI = productNameLI + quantityLI + deliveryDateLI + deliveryLocationLI + editOrderLineItemButtonLi + editCancelOrderLineItemButtonLi + deleteOrderLineItemButtonLi;
    var orderLineItemUL = `<ul class='orderLineItems'>${orderLineLI}</ul>`;
    //console.log(orderLineItemUL);
    orderLineItemsList += orderLineItemUL;
  }
  appendLineItemsToOrderSchedule(orderLineItemsList);
}

function formatDateString(dateString) {
  var timeStamp = Date.parse(dateString);
  var dateObject = new Date(timeStamp);
  var month = dateObject.toLocaleDateString("en-IN", {month: 'short' });
  var day = dateObject.getDate().toString();
  if (day.length < 2) {
    day = "0" + day;
  }
  var yyyy = dateObject.getFullYear();
  return month + " " + day + "," + yyyy;
}

function makeLineItemEditable(currentElement) {
  $(currentElement).parent().hide();
  $(currentElement).parent().parent().find('.orderlineitem-cancel-edit').show();
}

function cancelEditLineItem(currentElement) {
  $(currentElement).parent().hide();
  $(currentElement).parent().parent().find('.orderlineitem-edit').show();
}