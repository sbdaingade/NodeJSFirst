const express = require('express'); // Import the express module
const app = express(); // Create an Express application
const port = 3000; // Define the port your server will listen on

// Define a route for the root URL ('/')
app.get('/getData', (req, res) => {
  res.send('Hello World!'); // Send "Hello World!" as the response
});

// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
