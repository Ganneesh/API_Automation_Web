const express = require('express');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./server/swagger.json');

const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'server/views')));

// Mock Users Data
let users = [
  { id: 1, name: 'Ganesh', email: 'ganesh@example.com' },
  { id: 2, name: 'Tester', email: 'tester@example.com' }
];

// Homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'server/views/index.html'));
});

// GET paginated users
app.get('/users', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 2;
  const pagedUsers = users.slice((page - 1) * perPage, page * perPage);
  res.json({ page, per_page: perPage, total: users.length, data: pagedUsers });
});

// GET single user
app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ data: user });
});

// POST create user
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.status(201).json({ data: newUser });
});

// PUT update user
app.put('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { name, email } = req.body;
  user.name = name || user.name;
  user.email = email || user.email;
  res.json({ data: user });
});

// DELETE user
app.delete('/users/:id', (req, res) => {
  users = users.filter(u => u.id !== parseInt(req.params.id));
  res.status(204).send();
});

// POST login
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    return res.json({ token: 'fake-jwt-token' });
  }
  return res.status(400).json({ error: 'Missing email or password' });
});

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


// --- Additional Features ---

const jwt = require('jsonwebtoken');
const multer = require('multer');

// JWT Secret Key
const SECRET_KEY = 'ganesh-api-secret';

// Dummy auth login
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  }
  return res.status(400).json({ error: 'Missing credentials' });
});

// Auth middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = decoded;
    next();
  });
};

// Protected profile route
app.get('/profile', authenticate, (req, res) => {
  res.json({ message: 'Welcome to your profile', user: req.user });
});

// File upload setup
const upload = multer({ dest: 'uploads/' });
app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ message: 'File uploaded', file: req.file });
});

// User search by name
app.get('/users/search', (req, res) => {
  const { name } = req.query;
  const matched = users.filter(user => user.name.toLowerCase().includes(name.toLowerCase()));
  res.json({ results: matched });
});

// Simulate server error
app.get('/fail', (req, res) => {
  res.status(500).json({ error: 'Internal Server Error (Simulated)' });
});
