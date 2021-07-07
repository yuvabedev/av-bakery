$('#searchCustomerButton').click(function () {
  var searchQuery = $('#searchQuery').val();
  var searchBy = $("input[name='searchBy']:checked").val();

  clearCustomeSearch();
  console.log('Searching for ' + searchQuery + ' by ' + searchBy);

  var criteria = {};
  criteria.searchQuery = searchQuery;
  criteria.searchBy = searchBy;
  searchCustomers(criteria);
});

function searchCustomers(criteria) {
  $.get('searchCustomers', criteria)
    .done(function (data) {
      console.log('Request Success!!');
      console.log(data);
      displayRequestStatus(data);
      displayCustomerSearch(data);
      displayCustomerActions(data);
    })
    .fail(function (e) {
      console.log(e);
      if (e.status == 400) {
        displayError(e.responseText, "#searchMessage");
      }
    });
}

function displayError(errorMessage, divId) {
  $(divId).html(errorMessage).addClass('error');
}

function clearCustomeSearch() {
  hideMessages();
  console.log('Clearing customer search data....');
  $('#customerTable .row').remove();
  hideCustomerActions();
}

function hideMessages() {
  $('#searchMessage').html('').removeClass('error warning success');
  $('#editMessage').html('').removeClass('error');
}
function displayRequestStatus(data) {
  if (data.length < 1) {
    $('#searchMessage').html('No customers found with given search criteria').addClass('warning');
  } else {
    $('#searchMessage').html(`${data.length} customers found`).addClass('success');
  }
}
function displayCustomerSearch(data) {
  for (var row in data) {
    var customer = data[row];
    var customerRow = getRowForCustomer(customer);
    $('#customerTable').find('header').after(customerRow);
  }
}

function displayCustomerActions(data) {
  if (data.length > 0) {
    $('#customerActions').show();
  }
}

function hideCustomerActions() {
  $('#customerActions').hide();
}

function getRowForCustomer(customer) {
  var colCustomerIdRadio = getCustomerIdAsRadio(customer.id);
  var columnName = getCustomerAttributeAsColumn(customer.name);
  var columnAccount = getCustomerAttributeAsColumn(customer.account);
  var columnCommunity = getCustomerAttributeAsColumn(customer.community);
  var columnPhone = getCustomerAttributeAsColumn(customer.phone);
  var columnEmail = getCustomerAttributeAsColumn(customer.email);

  return `<div class="row">${colCustomerIdRadio}${columnName}${columnAccount}${columnCommunity}${columnPhone}${columnEmail}</div>`;
}

function getCustomerAttributeAsColumn(columnValue) {
  return `<div class="col">${columnValue}</div>`;
}

function getCustomerIdAsRadio(id) {
  return `<div class="col"><input type="radio" class="customerId" name="customerId" value="${id}" /></div>`;
}

$('#fetchCustomerToEditButton').click(function () {
  var customerId = $("input[name='customerId']:checked").val();
  if (customerId == undefined) {
    $('#editMessage').html('Please select a customer to edit').addClass('error');
    return;
  }
  console.log(`Fetching customer with id: ${customerId}`);

  window.location.href = `/customerEdit?customerId=${customerId}`;
});
