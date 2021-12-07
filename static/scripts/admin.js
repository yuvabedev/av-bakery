function logout() {
    $.post('logout')
    .done(function (data) {
      console.log('Logout Success!!');
      window.location.href = `/login?logout=success`;
  
    })
    .fail(function (e) {
      console.log(e);
    });
  }