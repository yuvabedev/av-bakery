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
    window.location.href = `/orderCreate?customerId=${customerId}`;
}

