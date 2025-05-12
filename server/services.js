const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

module.exports = function (app, db) {
  const users = db.collection('users');
  const products = db.collection('products');
  const wishlist = db.collection('wishlist');
  const projects = db.collection('projects');

  // Register new user
  app.post('/register', async (req, res) => {
    const { firstName, lastName, phone, email, password } = req.body;
    if (!firstName || !lastName || !phone || !email || !password) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existing = await users.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const hash = await bcrypt.hash(password, 10);
    await users.insertOne({ firstName, lastName, phone, email, password: hash });
    res.json({ success: true });
  });

  // Login
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Missing email or password' });
    }

    const user = await users.findOne({ email });
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    req.session.user = { id: user._id, email: user.email };
    res.json({ success: true });
  });

  // Logout
 app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).json({ success: false, message: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.redirect('/Dashboard.html'); 
  });
});


  // Session check
  app.get('/session_check', (req, res) => {
    if (!req.session.user) return res.status(401).end();
    res.status(200).end();
  });

  // Add product
  app.post('/add_product', async (req, res) => {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const data = { ...req.body, userId };
    await products.insertOne(data);
    res.json({ success: true });
  });

  // Get all products
  app.get('/products', async (req, res) => {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const results = await products.find({ userId }).toArray();
    res.json(results);
  });

  // Update product
  app.put('/update_product/:id', async (req, res) => {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { id } = req.params;
    let _id;
    try {
      _id = new ObjectId(id);
    } catch (err) {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }

    const allowedFields = ['name', 'manufacturer', 'type', 'color', 'location', 'quantity'];
    const updateFields = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateFields[field] = req.body[field];
      }
    });

    try {
      const result = await products.updateOne({ _id, userId }, { $set: updateFields });
      if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, message: 'Product not found or unauthorized' });
      }
      res.json({ success: true });
    } catch (err) {
      console.error("Edit failed:", err);
      res.status(500).json({ success: false, message: 'Edit failed' });
    }
  });

  // Delete product
  app.delete('/delete_product', async (req, res) => {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { _id } = req.body;
    try {
      const result = await products.deleteOne({ _id: new ObjectId(_id), userId });
      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: 'Product not found or unauthorized' });
      }
      res.json({ success: true });
    } catch (err) {
      console.error("Delete failed:", err);
      res.status(500).json({ success: false, message: 'Delete failed' });
    }
  });

  // Add wishlist item
  app.post('/add_wishlist', async (req, res) => {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const item = { ...req.body, userId };
    await wishlist.insertOne(item);
    res.json({ success: true });
  });

  // Get wishlist
  app.get('/get_wishlist', async (req, res) => {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const results = await wishlist.find({
        $or: [
          { userId },
          { userId: { $exists: false } }
        ]
      }).toArray();
      res.json(results);
    } catch (error) {
      console.error("Error loading wishlist:", error);
      res.status(500).json([]);
    }
  });

  // Search products
  app.post('/search', async (req, res) => {
    const { query, category } = req.body;
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const searchQuery = category === 'all' ? {
      userId,
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { type: { $regex: query, $options: 'i' } },
        { color: { $regex: query, $options: 'i' } },
        { manufacturer: { $regex: query, $options: 'i' } }
      ]
    } : {
      userId,
      [category]: { $regex: query, $options: 'i' }
    };

    const results = await products.find(searchQuery).toArray();
    res.json(results);
  });

  // Add project
  app.post('/add_project', async (req, res) => {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { name, description = "", images = [], colors = [], links = [], items = [] } = req.body;
    if (!name) return res.status(400).json({ success: false, message: "Project name is required" });

    const projectData = {
      userId,
      name,
      description,
      images,
      colors,
      links,
      items,
      createdAt: new Date()
    };

    try {
      await projects.insertOne(projectData);

      const wishlistItems = items.filter(item => item.addToWishlist);
      for (const item of wishlistItems) {
        await wishlist.insertOne({
          userId,
          name: item.name,
          color: item.color,
          type: item.type,
          store: item.store,
          price: item.price,
          addedFromProject: true,
          createdAt: new Date()
        });
      }

      res.json({ success: true });
    } catch (err) {
      console.error("Project save failed:", err);
      res.status(500).json({ success: false, message: "Project save failed" });
    }
  });

  // Get all projects
  app.get('/get_projects', async (req, res) => {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
      const results = await projects.find({ userId }).sort({ createdAt: -1 }).toArray();
      res.json({ success: true, projects: results });
    } catch (err) {
      console.error("Error loading projects:", err);
      res.status(500).json({ success: false, message: "Failed to load projects" });
    }
  });

  // Update project
  app.put('/update_project/:id', async (req, res) => {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { id } = req.params;
    let _id;
    try {
      _id = new ObjectId(id);
    } catch (err) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    try {
      const { _id: removeId, ...updateData } = req.body;
      const result = await projects.updateOne(
        { _id, userId },
        { $set: updateData }
    );

      if (result.matchedCount === 0) {
        return res.status(404).json({ success: false, message: "Project not found or unauthorized" });
      }
      res.json({ success: true });
    } catch (err) {
      console.error("Update failed:", err);
      res.status(500).json({ success: false, message: "Update failed" });
    }
  });

  // Delete project
  app.delete('/delete_project', async (req, res) => {
    const userId = req.session.user?.id;
    if (!userId) return res.status(401).json({ success: false, message: "Unauthorized" });

    const { _id } = req.body;
    try {
      const result = await projects.deleteOne({ _id: new ObjectId(_id), userId });
      if (result.deletedCount === 0) {
        return res.status(404).json({ success: false, message: "Project not found or unauthorized" });
      }
      res.json({ success: true });
    } catch (err) {
      console.error("Delete failed:", err);
      res.status(500).json({ success: false, message: "Delete failed" });
    }
  });
};