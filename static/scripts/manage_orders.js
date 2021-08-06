var deliveryLocations = {};

var urlParams = new URLSearchParams(window.location.search);
var customerId = urlParams.get('customerId');


$.get('deliveryLocations')
.done(function (data) {
  console.log('Delovery locations loaded....');
  deliveryLocations = data;
  console.log(deliveryLocations);
})
.fail(function (e) {
  console.log(e);
});

//Loading orders for current month
showOrderLineItemsForSection('currentMonth');

/**
 * This method is triggered when user click on "Click to Expand+" from Manage Orders UI
 * It loads the orders for section and displays thme to the Manage Orders Page
 * @param {} sectionName 
 */
function showOrderLineItemsForSection(sectionName) {
  var criteria = getCriteriaBasedOnSection(sectionName);
  fetchOrderLineItems(criteria, sectionName);
}

function getCriteriaBasedOnSection(sectionName) {
  var today = new Date();
  var dateMonth = today.getMonth();
  var year = today.getFullYear();

  //adding 1 because in javascript months are 0 indexed
  var currentMonth = dateMonth + 1;
  var nextMonth = dateMonth + 2;

  if (currentMonth.length < 2) {
    currentMonth = "0" + currentMonth;
  }

  if (nextMonth.length < 2) {
    nextMonth = "0" + nextMonth;
  }

  var startDate = `${year}-${currentMonth}-01`; 
  var endDate = `${year}-${nextMonth}-01`;

  var criteria = {};
  criteria.customerId =  customerId;
  criteria.startDate = startDate;
  criteria.endDate = endDate;
  return criteria;
}

function fetchOrderLineItems(criteria, sectionName) {
  console.log(criteria);
  $.get('orderLineItems', criteria)
  .done(function (data) {
    console.log('Request Success!!');
    displayOrderLinesForSection(data, sectionName);
  })
  .fail(function (e) {
    console.log(e);
    if (e.status == 400) {
      displayError(e.responseText, "#searchMessage");
    }
  });
}

function displayOrderLinesForSection(orderLines, sectionName) {

  //$('#loadMessage').html(`${activeOrders} Orders Found`).addClass('success');

  var orderLineItemsListElement = createOrderLinesListElement(orderLines);
  if (orderLineItemsListElement.length < 1) {
    $('#loadMessage-'+sectionName).html('No Orders Found').addClass('warning');
    return;
  }
  appendOrderLineItemsElementToSection(orderLineItemsListElement, sectionName);
}

function createOrderLinesListElement(orderLines) {
  var orderLineItemsList = "";

  for (index in orderLines) {
    var orderLine = orderLines[index];
    
    if (orderLine.status != 'ACTIVE') continue;

    var orderLineLI = "";
    var productNameLI = `<li style='display:inline' class='orderLineItem productView'>${orderLine.product_name}</li>`;
    var quantityLI = `<li style='display:inline' class='orderLineItem quantityView'>${orderLine.quantity}</li>`;
    var quantityEditLI = `<li style='display:none' class="orderLineItem quantityEdit"> 
                            <input type='text' name='quantity-${orderLine.id}' id='quantity-${orderLine.id}' class='text-input' value='${orderLine.quantity}' /> 
                          </li>`;
    var formattedDate = formatDateString(orderLine.delivery_date);
    var deliveryDateLI = `<li style='display:inline' class='orderLineItem deliveryDateView'>${formattedDate}</li>`;
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
    orderLineItemUL += orderLineUpdateMessageUL + "<hr>";
    //console.log(orderLineItemUL);
    orderLineItemsList += orderLineItemUL;
  }
  return orderLineItemsList;
}

function appendOrderLineItemsElementToSection(orderLineItemsListElement, sectionName) {
  var orderLineItemsDiv = $("#orderLineItems-"+sectionName);
  $(orderLineItemsDiv).replaceWith(orderLineItemsListElement);

  var orderLineItemsTableDiv = $("#orderTable-" + sectionName);
  orderLineItemsTableDiv.css("display", "block");

  toggleCollapseAndExpandButtons(sectionName);
}


/**
 * This function is called from Manage Orders UI when user clicks on "Click To Collapse-"
 * @param {*} sectionName 
 */
function hideOrderLineItemsForSection(sectionName) {
  toggleCollapseAndExpandButtons(sectionName);
  var orderLineItemsTableDiv = $("#orderTable-" + sectionName);
  orderLineItemsTableDiv.css("display", "none");
}

function toggleCollapseAndExpandButtons(sectionName) {
  var orderLineTableCollapseDiv = document.getElementById("collapse-" + sectionName);
  var orderLineTableExpandDiv = document.getElementById("expand-" + sectionName);
  toggleDisplay(orderLineTableCollapseDiv);
  toggleDisplay(orderLineTableExpandDiv);
}

function toggleDisplay(element) {
  if (element.style.display == "none") {
    element.style.display  = "inline";
  } else {
    element.style.display  = "none";
  }
}

function getULForUpdateMessage(orderLine) {
  var spanElement = `<span id="orderLineUpdateMessage-${orderLine.id}" style="display: none; height=10px;"></span>`
  //var orderLineItemUpdateMessage = `<ul class='orderLineItems'>${li}</ul>`;
  return spanElement;
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
      displayDeleteOrderLineItemMessage(currentElement);
      removeULForDeletedLineItem(currentElement);
    },
    error: function(error) {
      console.log(error.responseText);
      displayUpdateMessage(criteria.id, error.responseText, "error");
    }
  });
}

function displayDeleteOrderLineItemMessage(currentElement) {
  var orderLineItemId = currentElement.id.split('-')[1];
  var orderLineItemUL = $(currentElement).parent().parent();
  var productName = orderLineItemUL.find('.productView').text();
  var deliveryDate = orderLineItemUL.find('.deliveryDateView').text();
  var deleteConfirmMessage = `Order for ${productName} scheduled for delivery on ${deliveryDate} has been deleted and shall no longer be delivered.`;
  displayUpdateMessage(orderLineItemId, deleteConfirmMessage, 'success');
}

function removeULForDeletedLineItem(currentElement) {
  var orderLineItemUL = $(currentElement).parent().parent();
  orderLineItemUL.hide();
}