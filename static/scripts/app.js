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
  $('#customerTable .row').remove();
}

function displayCustomerSearch(data) {
  for (var row in data) {
    var customer = data[row];
    console.log('Customer:' + customer);
    var customerRow = getRowForCustomer(customer);
    $('#customerTable').find('header').after(customerRow);
  }

  function getRowForCustomer(customer) {
    var columnName = getColumnValueAsDiv(customer.name);
    var columnAccount = getColumnValueAsDiv(customer.account);
    var columnCommunity = getColumnValueAsDiv(customer.community);
    var columnPhone = getColumnValueAsDiv(customer.phone);
    var columnEmail = getColumnValueAsDiv(customer.email);

    return `<div class="row">${columnName}${columnAccount}${columnCommunity}${columnPhone}${columnEmail}</div>`;
  }

  function getColumnValueAsDiv(columnValue) {
    return `<div class="col">${columnValue}</div>`;
  }
}
