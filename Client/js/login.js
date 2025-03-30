console.log("login.js is loaded");
$(document).ready(function() {
    $('#open-login').click(function() {
        $('#overlay, #login-popup').fadeIn();
    });

    $('#close-login, #overlay').click(function() {
        $('#overlay, #login-popup').fadeOut();
    });

    $('#open-create-account').click(function() {
        $('#overlay, #create-account-popup').fadeIn();
    });

    $('#close-create-account, #overlay').click(function() {
        $('#overlay, #create-account-popup').fadeOut();
    });

    $('#login-btn').click(function() {
        const username = $('#username').val();
        const password = $('#password').val();
         
        const users = [
            { "username": "admin", "password": "1234567" },
            { "username": "user", "password": "password" }
        ];
   
        const user = users.find(user => user.username === username && user.password === password);
        
        if (user) {
            alert('Login successful!');
            $('#overlay, #login-popup').fadeOut();
        } else {
            alert('Invalid credentials');
        }
    });

    $('#create-account-btn').click(function() {
        const userData = {
            email: $('#email').val(),
            firstName: $('#first-name').val(),
            lastName: $('#last-name').val(),
            phone: $('#phone').val(),
            password: $('#new-password').val()
        };
        
        $.ajax({
            url: 'http://localhost:5000/create-account',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(userData),
            success: function(response) {
                if (response.success) {
                    alert(response.message);
                    $('#overlay, #create-account-popup').fadeOut();
                } else {
                    alert('Error: ' + response.message);
                }
            },
            error: function() {
                alert('Error connecting to server.');
            }
        });
    });
});     
