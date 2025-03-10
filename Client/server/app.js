const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors');

const app = express();
const port =5000;
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


//Page listeners(router)
var services = require("./services.js");
services.services(app);
services.initializeDatabase();

// Service Listeners(data processes)
server = app.listen(port, function(err) {
    if (err) {
      throw err;
    }
    console.log("Listening on port " + port);
});


