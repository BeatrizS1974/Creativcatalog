const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, '../Client'))); 

var cors = require('cors')
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/userLog');

const UserSchema = new mongoose.Schema({
    email: String,
    firstName: String,
    lastName: String,
    phone: String,
    password: String
});

const User = mongoose.model('User', UserSchema);

// Create account endpoint
app.post('/create-account', async (req, res) => {
    try {
        const { email, firstName, lastName, phone, password } = req.body;
        const newUser = new User({ email, firstName, lastName, phone, password });
        await newUser.save();
        res.json({ success: true, message: 'Account created successfully!' });
    } catch (error) {
        res.json({ success: false, message: 'Error creating account', error });
    }
});



const router = require("./router");
router(app);

//define the server
var server;
var port = process.env.PORT || process.env.NODE_PORT || 5000

//Service listeners
var services = require("./services.js");
services.services(app);
//*services.initializeDatabase();

//Start server and listen
server = app.listen(port, function(err) {
    if (err) {
      throw err;
    }
    console.log("Listening on port " + port);
});
