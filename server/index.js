const express = require('express');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to Ganesh API Automation Hub!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
