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
      $(orderLineItemsUL).prependTo("#orderLineItems");
}

function removeOrderLineItem(currentElement) {
    //console.log($(currentElement).attr("class").split(/\s+/));
    var ulElement = $(currentElement).closest('ul');
    ulElement.remove();
}

$("#confirmOrderSchedule").click(function() {
  var orderSchedule = getOrderSchedule();
  saveOrderSchedule(orderSchedule);
});

function saveOrderSchedule(orderSchedule) {
  console.log("Saving order schedule...");
  $.post('saveOrderSchedule', orderSchedule)
    .done(function (data) {
      console.log('Order Schedule Saved With id');
    })
    .fail(function (e) {
      console.log(e);
      if (e.status == 400) {
        displayError(e.responseText, "#saveMessage");
      }
    });
}

function getOrderLineItems() {

}