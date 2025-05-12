const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const { MongoClient } = require('mongodb');


const app = express();
const PORT = 3000;

// MongoDB Local Connection
const client = new MongoClient('mongodb://127.0.0.1');

// Middleware
app.use(session({
  secret: 'creativSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 1000 * 60 * 60
  }
}));

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static(path.join(__dirname, '../Client')));

client.connect().then(() => {
  const db = client.db('creativCatalog');
  require('./services')(app, db);
  require('./router')(app);

  app.listen(PORT, () => {
    console.log(`HTTP Server running at http://localhost:${PORT}`);
  });
}).catch(err => console.error('MongoDB Connection Error:', err));