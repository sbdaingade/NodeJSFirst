const express = require('express'); // Import the express module
const app = express(); // Create an Express application
const port = 3000; // Define the port your server will listen on

app.use(express.json()); 
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
        res.status(200).json({ status: 'passed', message: 'Login successful'});
    } else {
        res.status(401).json({ status: 'failed', message: 'Invalid credentials' });
    }
});

// Define a route for the root URL ('/')
app.get('/getData', (req, res) => {
  res.send('Hello World! Sachin Daingade'); // Send "Hello World!" as the response
});

// 
app.get('/getDate', (req, res) => {

    const now = new Date();
    const responseData = {
       iso: now.toISOString(), // Correct: Call the method with ()
        localeString: now.toLocaleString(),
        dateString: now.toLocaleDateString(),
        timeString: now.toLocaleTimeString(),
       // customFormat: `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    };
   // res.json(responseData);

    res.status(200).json({ status: responseData});
});



// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

