document.addEventListener('DOMContentLoaded', function () {
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', function (e) {
      e.preventDefault();

      fetch('/logout', {
        method: 'POST',
        credentials: 'include'
      })
        .then(res => {
          if (res.ok) {
            window.location.href = '/login.html';
          } else {
            alert("Logout failed.");
          }
        })
        .catch(err => {
          console.error("Logout error:", err);
          alert("An error occurred while logging out.");
        });
    });
  }
  
});
