//Bring in Mongo 
const { MongoClient, ObjectId } = require('mongodb');

//Define Database URL
const dbUrl = process.env.DB_URI || "mongodb://127.0.0.1";

//Define the database client
const client = new MongoClient(dbUrl);

var services = function(app) {

    app.post('/add_product', async function(req, res) {
        var newProduct = {
            name: req.body.name,
            manufacturer: req.body.manufacturer,
            type: req.body.type,
            color: req.body.color,
            location: req.body.location,
            quantity: req.body.quantity
        };

        var search = { name: req.body.name };

        try {
            const conn = await client.connect();
            const db = conn.db("myCatalog");
            const coll = db.collection("collection");

            const product = await coll.find(search).toArray();

            if (product.length > 0) {
                await conn.close();
                return res.send(JSON.stringify({ msg: "Product Already Exists" }));
            } else {
                await coll.insertOne(newProduct);
                await conn.close();
                return res.send(JSON.stringify({ msg: "SUCCESS" }));
            }
        } catch (error) {
            return res.send(JSON.stringify({ msg: "Error: " + error }));
        }
    });

    app.get('/get_product', async function(req, res) {
        res.send('Product fetched successfully');
    });

    app.get('/get_ProductByType', async function(req, res) {
        res.send('Products by type fetched successfully');
    });

    app.put('/edit_product', async function(req, res) {
        var search = { name: req.body.name };

        try {
            const conn = await client.connect();
            const db = conn.db("myCatalog");
            const coll = db.collection("collection");

            const data = await coll.find(search).toArray();
            await conn.close();
            return res.send(JSON.stringify({ msg: "SUCCESS", product: data }));

        } catch (error) {
            return res.send(JSON.stringify({ msg: "Error: " + error }));
        }
    });

    app.delete('/delete_product', async function(req, res) {
        var search = { name: req.body.name };

        try {
            const conn = await client.connect();
            const db = conn.db("myCatalog");
            const coll = db.collection("collection");

            await coll.deleteOne(search);
            await conn.close();
            return res.send(JSON.stringify({ msg: "SUCCESS" }));

        } catch (error) {
            return res.send(JSON.stringify({ msg: "Error: " + error }));
        }
    });

    app.post('/refreshProduct', async function(req, res) {
        try {
            const conn = await client.connect();
            const db = conn.db("myCatalog");
            const coll = db.collection("collection");
            await coll.drop();
            console.log("Dropped database");
            await conn.close();
            await initializeDatabase();
            return res.status(200).send(JSON.stringify({ msg: "SUCCESS" }));
        } catch (err) {
            console.log(err);
            return res.status(500).send(JSON.stringify({ msg: "Error: " + err }));
        }
    });

    console.log("Services initialized.");
};

//To Initialize the products table
var initializeDatabase = async function() {
    try {
        const conn = await client.connect();
        const db = conn.db("myCatalog");
        const coll = db.collection("collection");
        const data = await coll.find().toArray();

        if (data.length === 0) {
           console.log("No initial data to seed.")
        }

        await conn.close();
    } catch (err) {
        console.log(err);
    }
};

module.exports = { services, initializeDatabase };
