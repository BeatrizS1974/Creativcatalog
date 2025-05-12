document.getElementById('logout-link').addEventListener('click', function (e) {
  e.preventDefault();

  fetch('/logout', {
    method: 'POST',
    credentials: 'include'
  })
    .then(response => {
      // Check if response is JSON or HTML
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return response.json();
      } else {
        // fallback to redirect
        window.location.href = '/login.html';
      }
    })
    .then(data => {
      if (data?.success) {
        const banner = document.getElementById('logout-banner');
        banner.style.display = 'block';

        setTimeout(() => {
          banner.style.display = 'none';
          window.location.href = '/';
        }, 1500);
      }
    })
    .catch(err => {
      alert("Error logging out.");
      console.error(err);
    });
});
