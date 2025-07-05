const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));

// Mock data
let users = [
  { id: 1, name: 'Ganesh', email: 'ganesh@example.com' },
  { id: 2, name: 'Tester', email: 'tester@example.com' }
];

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.get('/users', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = 2;
  const pagedUsers = users.slice((page - 1) * perPage, page * perPage);
  res.json({ page, per_page: perPage, total: users.length, data: pagedUsers });
});

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ data: user });
});

app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.status(201).json({ data: newUser });
});

app.put('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { name, email } = req.body;
  user.name = name || user.name;
  user.email = email || user.email;
  res.json({ data: user });
});

app.delete('/users/:id', (req, res) => {
  users = users.filter(u => u.id !== parseInt(req.params.id));
  res.status(204).send();
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    return res.json({ token: 'fake-jwt-token' });
  }
  return res.status(400).json({ error: 'Missing email or password' });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
