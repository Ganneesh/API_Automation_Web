const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

let users = [
  { id: 1, name: "Alice", email: "alice@mail.com", status: "active" },
  { id: 2, name: "Bob", email: "bob@mail.com", status: "inactive" }
];

app.use(express.json());
app.use(require('cors')());

// GET all users
app.get('/api/users', (req, res) => res.json(users));

// GET single user
app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id == req.params.id);
  user ? res.json(user) : res.status(404).json({ error: "User not found" });
});

// POST create user
app.post('/api/users', (req, res) => {
  const newUser = { id: Date.now(), ...req.body };
  users.push(newUser);
  res.status(201).json(newUser);
});

// PUT update user
app.put('/api/users/:id', (req, res) => {
  const index = users.findIndex(u => u.id == req.params.id);
  if (index >= 0) {
    users[index] = { ...users[index], ...req.body };
    res.json(users[index]);
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// DELETE user
app.delete('/api/users/:id', (req, res) => {
  users = users.filter(u => u.id != req.params.id);
  res.status(204).send();
});

app.listen(PORT, () => console.log(`🚀 Ganesh API Automation Hub running at http://localhost:${PORT}`));
