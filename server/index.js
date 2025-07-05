const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

// 👇 Add this root route
app.get('/', (req, res) => {
  res.send(`
    <h2>👋 Welcome to Ganesh API Automation Hub</h2>
    <p>Available endpoints:</p>
    <ul>
      <li><code>GET /users</code></li>
      <li><code>POST /login</code></li>
      <li><code>PUT /users/:id</code></li>
      <li><code>DELETE /users/:id</code></li>
    </ul>
    <p>Use tools like Postman or Swagger to interact with these endpoints.</p>
  `);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
