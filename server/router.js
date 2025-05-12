const path = require('path');

module.exports = function(app) {
  // Default route sends to login or dashboard depending on session
  app.get('/', (req, res) => {
    if (req.session.user) {
      res.redirect('/landing.html');  // user is logged in
    } else {
      res.sendFile('Dashboard.html', { root: path.join(__dirname, '../Client') }); // not logged in
    }
  });

  // Authenticated landing page
  app.get('/landing.html', (req, res) => {
    if (!req.session.user) {
      return res.redirect('/Dashboard');
    }
    res.sendFile('landing.html', { root: path.join(__dirname, '../Client') });
  });

  // Just in case /dashboard is accessed directly
  app.get('/Dashboard', (req, res) => {
    res.sendFile('Dashboard.html', { root: path.join(__dirname, '../Client') });
  });
};
