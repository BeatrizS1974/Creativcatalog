const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

app.use(express.static(path.join(__dirname, 'Client'))); 

var cors = require('cors')
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const router = require("./router");
router(app);

//define the server
var server;
var port = process.env.PORT || process.env.NODE_PORT || 5000

//Service listeners
var services = require("./services.js");
services.services(app);
services.initializeDatabase();

//Start server and listen
server = app.listen(port, function(err) {
    if (err) {
      throw err;
    }
    console.log("Listening on port " + port);
});
