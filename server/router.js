const path = require('path');
const bcrypt = require('bcrypt');
const { services } = require('./services.js');

//Page Listener(router)
var router = function(app) {

app.get("/", function(req, res){
    res.status(200).sendFile(path.join(__dirname + "/../Client/login.html"));
});

app.get("/Dashboard", function(req, res){
    res.status(200).sendFile(path.join(__dirname + "/../Client/Dashboard.html"));
});

app.get("/add_products", function(req, res){
    res.status(200).sendFile(path.join(__dirname + "/../Client/add_products.html"));
});
app.get("/browse", function(req, res){
    res.status(200).sendFile(path.join(__dirname + "/../Client/browse.html"));
});
app.get("/wishlist", function(req, res){
    res.status(200).sendFile(path.join(__dirname + "/../Client/wishlist.html"));
});
}

module.exports = router;