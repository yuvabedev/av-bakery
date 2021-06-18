$('#searchCustomerButton').click(function () {
  var searchQuery = $('#searchQuery').val();
  if (searchQuery.trim().length < 3) {
    alert('To search please enter atleast of 3 characters');
    return;
  }

  var searchBy = $("input[name='searchBy']:checked").val();
  if (!searchBy) {
    alert('Please select whether to search by account or name');
    return;
  }
  console.log('Search criteria successfully validated');
  console.log('Searching for ' + searchQuery + ' by ' + searchBy);

  var criteria = {};
  criteria.searchQuery = searchQuery;
  criteria.searchBy = searchBy;
  searchCustomers(criteria);
});

function searchCustomers(criteria) {
  console.log(criteria);

  $.post('searchCustomers', criteria).done(function (data) {
    console.log(data);
  });
}
