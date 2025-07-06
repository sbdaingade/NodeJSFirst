const express = require('express'); // Import the express module
const app = express(); // Create an Express application
const port = 3000; // Define the port your server will listen on

// Define a route for the root URL ('/')
app.get('/getData', (req, res) => {
  res.send('Hello World!'); // Send "Hello World!" as the response
});

// 
const users = [
    { email: 'sachin@gmail.com', password: 'Pass@1234' },
    { email: 'admin@gmail.com', password: 'Admin@1234' }
];

// Route for handling login requests
app.post('/login', (req, res) => {
    const { email, password } = req.body; // Extract email and password from the request body

    // Basic validation
    if (!email || !password) {
        return res.status(400).json({ status: 'fail', message: 'Email and password are required' });
    }

    // Simulate checking credentials against our "database"
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // In a real application, you'd generate a token (JWT) here
        res.status(200).json({ status: 'pass', message: 'Login successful'});
    } else {
        res.status(401).json({ status: 'fail', message: 'Invalid credentials' });
    }
});



// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
