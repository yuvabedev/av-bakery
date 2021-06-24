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
  console.log(criteria);

  $.post('searchCustomers', criteria)
    .done(function (data) {
      console.log(data);
      displayRequestStatus(data);
      displayCustomerSearch(data);
    })
    .fail(function (e) {
      console.log(e);
      if (e.status == 400) {
        displayError(e.responseText);
      }
    });
}

function displayError(errorMessage) {
  $('#requestError').html(errorMessage);
}
function clearCustomeSearch() {
  console.log('Clearing customer search data....');
  $('#requestError').html('');
  $('#responseError').html('');
  $('#responseSuccess').html('');
  $('#customerTable .row').remove();
}

function displayRequestStatus(data) {
  if (data.length < 1) {
    $('#responseError').html('No customers found with given search criteria');
  } else {
    $('#responseSuccess').html(`${data.length} customers found`);
  }
}
function displayCustomerSearch(data) {
  for (var row in data) {
    var customer = data[row];
    console.log('Customer:' + customer);
    var customerRow = getRowForCustomer(customer);
    $('#customerTable').find('header').after(customerRow);
  }
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
