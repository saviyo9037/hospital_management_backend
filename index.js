// index.js (main server)
const express = require('express');
const app = express();
const router = require('./routes');
const run = require('./DB/connectionDB');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const bodyParser = require('body-parser');
const path = require('path');

run();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../Frontend/dist')));

// API routes
app.use("/api", router);

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../Frontend/dist/index.html'));
// });

app.use(errorHandler);

app.listen(5000, () => {
  console.log("✅ Server is running on port 5000");
});