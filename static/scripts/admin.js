function logout() {
  $.post('logout')
  .done(function (data) {
    console.log('Logout Success!!');
    window.location.href = `/login?logoutSuccess=true`;
  })
  .fail(function (e) {
    console.log(e);
  });
}