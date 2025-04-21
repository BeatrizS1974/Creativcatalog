const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const session = require('express-session');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../Client')));

app.use(session({
  secret: 'creativSecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/creativCatalog')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err));

// Mongoose Schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  password: String
});
const User = mongoose.model('User', userSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'Client', 'Dashboard.html'));
});

// Create Account
app.post('/create-account', async (req, res) => {
  try {
    let { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'All fields required.' });
    }

    email = email.toLowerCase();
    const existing = await User.findOne({ email });
    if (existing) {
      return res.json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, email, phone, password: hashedPassword });
    await newUser.save();

    res.json({ success: true, message: 'Account created successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Missing credentials' });
    }

    email = email.toLowerCase();
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: 'Incorrect password' });
    }

    // Save session info
    req.session.user = { id: user._id, email: user.email };
    res.json({ success: true, message: 'Login successful!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Protected Landing Page
app.get('/landing.html', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '..', 'Client', 'landing.html'));
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// ✅ Mount product-related services
const { services, initializeDatabase } = require('./services');
services(app);
initializeDatabase();

// Start Server
app.listen(PORT, () => {
  console.log(`Server running: http://localhost:${PORT}`);
});
