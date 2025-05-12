$(document).ready(function () {
  // 🔹 Open modals
  $('#open-login').click(function () {
    $('#login-modal').show();
  });

  $('#open-create-account').click(function () {
    $('#create-account-modal').show();
  });

  // 🔹 Close modals
  $('#close-login').click(function () {
    $('#login-modal').hide();
  });

  $('#close-create-account').click(function () {
    $('#create-account-modal').hide();
  });

  // 🔹 Close modal when clicking outside of it
  $(window).on('click', function (e) {
    if ($(e.target).is('#login-modal')) {
      $('#login-modal').hide();
    }
    if ($(e.target).is('#create-account-modal')) {
      $('#create-account-modal').hide();
    }
  });

  // 🔹 Handle login form submission
  $('#login-form').submit(async function (e) {
    e.preventDefault();

    const email = $('#login-email').val();
    const password = $('#login-password').val(); // corrected ID

    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        window.location.href = '/landing.html';
      } else {
        alert(data.message || 'Login failed.');
      }
    } catch (err) {
      alert('Error connecting to server.');
      console.error(err);
    }
  });
});
// 🔹 Handle registration form submission
$('#register-form').submit(async function (e) {
  e.preventDefault();

  const firstName = $('#first-name').val();
  const lastName = $('#last-name').val();
  const phone = $('#phone').val();
  const email = $('#register-email').val();
  const password = $('#new-password').val();

  try {
    const res = await fetch('/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, phone, email, password })
    });

    const data = await res.json();

    if (data.success) {
      alert('Account created successfully!');
      $('#create-account-modal').hide();
      $('#register-form')[0].reset();
    } else {
      alert(data.message || 'Registration failed.');
    }
  } catch (err) {
    alert('Error connecting to server.');
    console.error(err);
  }
});
