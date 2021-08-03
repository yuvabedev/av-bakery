var deliveryLocations = {};

$.get('deliveryLocations')
.done(function (data) {
  console.log('Delovery locations loaded....');
  deliveryLocations = data;
  console.log(deliveryLocations);
})
.fail(function (e) {
  console.log(e);
});

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
    return;
  } 

  var activeOrders = 0;
  var orderLineItemsList = "";

  for (index in orderLines) {
    var orderLine = orderLines[index];
    
    if (orderLine.status != 'ACTIVE') continue;

    var orderLineLI = "";
    var productNameLI = `<li style='display:inline' class='orderLineItem'>${orderLine.product_name}</li>`;
    var quantityLI = `<li style='display:inline' class='orderLineItem quantityView'>${orderLine.quantity}</li>`;
    var quantityEditLI = `<li style='display:none' class="orderLineItem quantityEdit"> 
                            <input type='text' name='quantity-${orderLine.id}' id='quantity-${orderLine.id}' class='text-input' value='${orderLine.quantity}' /> 
                          </li>`;
    var formattedDate = formatDateString(orderLine.delivery_date);
    var deliveryDateLI = `<li style='display:inline' class='orderLineItem'>${formattedDate}</li>`;
    var deliveryLocationLI = `<li style='display:inline' class='orderLineItem deliveryLocationView'>${orderLine.delivery_location}</li>`;
    var deliveryLocationDrodown = createDeliveryLocationDropdown(`${orderLine.delivery_location}`, orderLine.id);
    var deliveryLocationDropDownLI = `<li style='display:none' class='orderLineItem deliveryLocationEdit'>${deliveryLocationDrodown}</li>`;
    
    //edit buttons
    var editOrderLineItemButtonLi = `<li style='display:inline;' class='orderLineItem-Edit' id="orderLineItem-${orderLine.id}"><button onClick='javascript:makeLineItemEditable(this)' class='customer-button'>Edit</button></li>`;
    var editCancelOrderLineItemButtonLi = `<li style='display:none;' class='orderLineItem-cancelEdit'><button onClick='javascript:cancelEditLineItem(this)' class='customer-button' id='cancelEditLineItem-${orderLine.id}'>Cancel</button></li>`;
    var editSaveOrderLineItemButtonLi = `<li style='display:none; margin-left: 20px;' class='orderLineItem-saveEdit'><button onClick='javascript:saveEditToLineItem(this)' class='customer-button' id='orderLineItemSave-${orderLine.id}'>Save</button></li>`;
    var deleteOrderLineItemButtonLi = `<li style='display:inline; margin-left: 20px;'><button onClick='javascript:deleteLineItem(this)' class='customer-button' id='orderLineItemDelete-${orderLine.id}'>Delete</button></li>`;
    
    var orderLineLI = productNameLI + quantityLI + quantityEditLI +deliveryDateLI + deliveryLocationLI + deliveryLocationDropDownLI +
                  editOrderLineItemButtonLi + editCancelOrderLineItemButtonLi + editSaveOrderLineItemButtonLi + deleteOrderLineItemButtonLi;
    var orderLineItemUL = `<ul class='orderLineItems'>${orderLineLI}</ul>`;
    var orderLineUpdateMessageUL = getULForUpdateMessage(orderLine);
    orderLineItemUL += orderLineUpdateMessageUL;
    //console.log(orderLineItemUL);
    orderLineItemsList += orderLineItemUL;
    activeOrders++;
  }

  $('#loadMessage').html(`${activeOrders} Orders Found`).addClass('success');

  appendLineItemsToOrderSchedule(orderLineItemsList);
}

function getULForUpdateMessage(orderLine) {
  var li = `<li><span id="orderLineUpdateMessage-${orderLine.id}" style="display: none;"></span></li>`
  var orderLineItemUpdateMessage = `<ul class='orderLineItems'>${li}</ul>`;
  return orderLineItemUpdateMessage;
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
  //hide edit line item button
  $(currentElement).parent().hide();
  //show cancel edit button
  $(currentElement).parent().parent().find('.orderLineItem-cancelEdit').css("display", "inline");
  $(currentElement).parent().parent().find('.orderLineItem-saveEdit').css("display", "inline");

  //hide view quantity element
  $(currentElement).parent().parent().find('.quantityView').hide();
  $(currentElement).parent().parent().find('.deliveryLocationView').hide();

  //show edit quantity element
  $(currentElement).parent().parent().find('.quantityEdit').show();
  $(currentElement).parent().parent().find('.deliveryLocationEdit').show();
}

function cancelEditLineItem(currentElement) {
  //hide cancel button
  $(currentElement).parent().hide();
  //hide save button
  $(currentElement).parent().parent().find('.orderLineItem-saveEdit').hide();
  //show edit button
  $(currentElement).parent().parent().find('.orderLineItem-Edit').show();

    //show view quantity element
  $(currentElement).parent().parent().find('.quantityView').show();
  $(currentElement).parent().parent().find('.deliveryLocationView').show();
    //hide edit quantity element
  $(currentElement).parent().parent().find('.quantityEdit').hide();
  $(currentElement).parent().parent().find('.deliveryLocationEdit').hide();
  var orderLineItemId = currentElement.id.split('-')[1];
  hideUpdateMessage(orderLineItemId);
}

function createDeliveryLocationDropdown(selectedLocation, orderLineItemId) {
  var dropDown = `<select class="select-menu" name="deliveryLocation" id="deliveryLocation-${orderLineItemId}">`;
  deliveryLocations.forEach(function(location) {
    var option = "";
    if (selectedLocation == location.name) {
      option = `<option value="${location.name}" selected>${location.name}</option>`;
    } else {
      option = `<option value="${location.name}">${location.name}</option>`;
    }
    dropDown = dropDown + option;
  });
  dropDown = dropDown + "</select>";
  return dropDown;
 }

 function saveEditToLineItem(currentElement) {
   
   var criteria = {};
   var updateMessage = "";
   var previousQuantity = $(currentElement).parent().parent().find('.quantityView').text();
   var orderLineItemId = currentElement.id.split('-')[1];
   console.log("Editing orderline item " + orderLineItemId);

   hideUpdateMessage(orderLineItemId);

   var updateMade = false;
   var editedQuantity = $(currentElement).parent().parent().find('.quantityEdit').find('input').val();
   if (previousQuantity != editedQuantity) {
     updateMessage += `Quantity updated from ${previousQuantity} to ${editedQuantity}`;
     updateMade = true;
   }
   var previousDeliveryLocation = $(currentElement).parent().parent().find('.deliveryLocationView').text();
   var editedDeliveryLocation = $('#deliveryLocation-'+orderLineItemId).find(":selected").val();

   if (previousDeliveryLocation != editedDeliveryLocation) {
    updateMessage += `<BR>DeliveryLocation updated from ${previousDeliveryLocation} to ${editedDeliveryLocation}`;
    updateMade = true;
  }


  if (!updateMade) {
    updateMessage = "Nothing updated as no values were changed. Please update quantity or delivery location and save again."
    displayUpdateMessage(orderLineItemId, updateMessage, 'warning');
    return;
  }
  
  criteria.id = orderLineItemId;
  criteria.quantity = editedQuantity;
  criteria.deliveryLocation = editedDeliveryLocation;

  updateOrderLineItem(criteria, currentElement, updateMessage);
 } //function end

 function displayUpdateMessage(orderLineItemId, updateMessage, className) {
  var updateMessageDisplayId= `#orderLineUpdateMessage-${orderLineItemId}`;
  $(updateMessageDisplayId).html(updateMessage).addClass(className);
  $(updateMessageDisplayId).show();
 }

 function hideUpdateMessage(orderLineItemId) {
  var updateMessageDisplayId= `#orderLineUpdateMessage-${orderLineItemId}`;
  $(updateMessageDisplayId).html('').removeClass('error warning success');
 }

 /**
  * persists the changes to order line item into the database
  * @param {*} criteria 
  */
 function updateOrderLineItem(criteria, currentElement, updateMessage) {
    $.ajax({
      url: 'orderLineItemUpdate',
      type: 'PUT',
      data: criteria,
      success: function(response) {
        console.log(updateMessage)
        displayUpdateMessage(criteria.id, updateMessage, "success");
        reloadLineItem(response, currentElement);
      },
      error: function(error) {
        console.log(error.responseText);
        displayUpdateMessage(criteria.id, error.responseText, "error");
      }
  });
 }
 

 function reloadLineItem(response, currentElement) {
  //hide save button
  $(currentElement).parent().hide();
  //hide cancel button
  $(currentElement).parent().parent().find('.orderLineItem-cancelEdit').hide();
  //show edit button
  $(currentElement).parent().parent().find('.orderLineItem-Edit').show();

    //show view quantity element
  $(currentElement).parent().parent().find('.quantityView').show();
  $(currentElement).parent().parent().find('.deliveryLocationView').show();
    //hide edit quantity element
  $(currentElement).parent().parent().find('.quantityEdit').hide();
  $(currentElement).parent().parent().find('.deliveryLocationEdit').hide();

  var updatedOrderLineItem = response[0];
  console.log(updatedOrderLineItem);

  $(currentElement).parent().parent().find('.quantityView').text(updatedOrderLineItem.quantity);
  $(currentElement).parent().parent().find('.deliveryLocationView').text(updatedOrderLineItem.delivery_location);

  //drawAndFadeBorder($(currentElement).parent().parent());
 
}

function drawAndFadeBorder(ulElement) {
  ulElement.css("border", "1px solid black");
}


/**
 * handles delete event from UI
 * @param {*} currentElement 
 */
function deleteLineItem(currentElement) {
  var criteria = {};
  var orderLineItemId = currentElement.id.split('-')[1];
  console.log("Deleting orderline item " + orderLineItemId);
  criteria.id = orderLineItemId;
  $.ajax({
    url: 'orderLineItemDelete',
    type: 'PUT',
    data: criteria,
    success: function(response) {
    
    },
    error: function(error) {
      console.log(error.responseText);
      displayUpdateMessage(criteria.id, error.responseText, "error");
    }
});
}
