console.log("login.js is loaded");

$(document).ready(function () {
  // Show login modal
  $('#open-login').click(function () {
    $('#login-modal').fadeIn();
  });

  // Show register modal
  $('#open-create-account').click(function () {
    $('#create-account-modal').fadeIn();
  });

  // Close buttons (X icons)
  $('#close-login, #close-create-account').click(function () {
    $('.modal').fadeOut();
  });

  // Close modal when clicking outside content
  $('.modal').click(function (event) {
    if (event.target === this) {
      $(this).fadeOut();
    }
  });

  // ✅ Handle Login Form Submit (AJAX)
  $('#login-form').submit(function (e) {
    e.preventDefault();

    const email = $('#username').val();
    const password = $('#password').val();

    $.ajax({
      url: 'http://localhost:5000/login',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ email, password }),
      success: function (response) {
        if (response.success) {
          alert("Login successful!");
          $('#login-modal').fadeOut();
          window.location.href = "/landing.html";
        } else {
          alert("Login failed: " + response.message);
        }
      },
      error: function () {
        alert("Error connecting to server.");
      }
    });
  });

  // ✅ Handle Register Form Submit (AJAX)
  $('#register-form').submit(function (e) {
    e.preventDefault();

    const userData = {
      firstName: $('#first-name').val(),
      lastName: $('#last-name').val(),
      email: $('#email').val(),
      phone: $('#phone').val(),
      password: $('#new-password').val()
    };

    $.ajax({
      url: 'http://localhost:5000/create-account',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(userData),
      success: function (response) {
        if (response.success) {
          alert("Account created successfully!");
          $('#create-account-modal').fadeOut();
        } else {
          alert("Registration failed: " + response.message);
        }
      },
      error: function () {
        alert("Error connecting to server.");
      }
    });
  });
});
