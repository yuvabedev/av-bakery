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


$('#saveOrderSchedule').click(function () {
  console.log("Saving order schedule...");
  $('#saveMessage').html('').removeClass('error warning success');
  orderSchedule = {};
  orderSchedule.productName = $('#breads').find(":selected").val();
  orderSchedule.quantity =  $('#quantity').val();
  orderSchedule.startDate = $('#startDate').val();
  orderSchedule.deliverySchedule = $('#deliverySchedule').find(":selected").val();
  orderSchedule.deliveryLocation = $('#deliveryLocation').find(":selected").val();
  saveOrderSchedule(orderSchedule);
});

function saveOrderSchedule(orderSchedule) {
  console.log("Saving order schedule...");
  console.log(orderSchedule);
  $.post('orderScheduleSave', orderSchedule)
    .done(function (data) {
      console.log('Order Schedule Saved!!');
    })
    .fail(function (e) {
      console.log(e);
      if (e.status == 400) {
        displayError(e.responseText, "#saveMessage");
      }
    });
}

function createOrderLines(orderSchedule) {

}