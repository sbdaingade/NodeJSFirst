const express = require('express'); // Import the express module
const app = express(); // Create an Express application
const port = 3000; // Define the port your server will listen on

app.use(express.json()); 
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
});

// Change this line:
app.get('/curren-date', (req, res) => { // Notice the missing 't' here to match your typo
    const now = new Date();
    const responseData = {
        isoDate: now.toISOString().split('T')[0],
        localeDate: now.toLocaleDateString(),
        customMMDDYYYY: `${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}-${now.getFullYear()}`,
        customDDMMYYYY: `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`,
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        dayOfWeek: now.getDay()
    };
    res.json(responseData);
});

const users = [
    { email: 'sachin@gmail.com', password: 'Pass@1234' },
    { email: 'admin@gmail.com', password: 'Admin@1234' }
];

// Route for handling login requests
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log('Received email:', email); // Add this for debugging!
    console.log('Received password:', password); 

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

// Define a route for the root URL ('/')
app.get('/getData', (req, res) => {
  res.send('Hello World! Sachin'); // Send "Hello World!" as the response
});



// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
