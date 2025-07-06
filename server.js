const express = require('express'); // Import the express module
const app = express(); // Create an Express application
const db = require('./database'); // Import our database connection
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
    };
    res.status(200).json({ status: responseData});
});

// ===================================================== Database  ================================================

// --- Routes ---

// 1. GET all users
app.get('/users', (req, res) => {
    db.all("SELECT * FROM users", [], (err, rows) => {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        });
    });
});

// 2. GET a single user by ID
app.get('/users/:id', (req, res) => {
    const id = req.params.id;
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        if (row) {
            res.json({
                "message": "success",
                "data": row
            });
        } else {
            res.status(404).json({ "message": "User not found" });
        }
    });
});

// 3. POST (Create) a new user
app.post('/users', (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ "error": "Name and email are required" });
    }

    // Basic email format check (optional but good practice)
    if (!email.includes('@') || !email.includes('.')) {
        return res.status(400).json({ "error": "Invalid email format" });
    }

    db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], function (err) {
        if (err) {
            // Check for unique constraint violation (email already exists)
            if (err.message.includes('SQLITE_CONSTRAINT_UNIQUE')) {
                return res.status(409).json({ "error": "Email already exists" });
            }
            res.status(500).json({ "error": err.message });
            return;
        }
        res.status(201).json({
            "message": "User created successfully",
            "id": this.lastID, // Get the ID of the newly inserted row
            "name": name,
            "email": email
        });
    });
});

// 4. PUT (Update) an existing user
app.put('/users/:id', (req, res) => {
    const id = req.params.id;
    const { name, email } = req.body;

    if (!name && !email) { // Allow partial updates
        return res.status(400).json({ "error": "At least one field (name or email) is required for update" });
    }

    // Build the SET clause dynamically for partial updates
    let updates = [];
    let params = [];
    if (name) {
        updates.push("name = ?");
        params.push(name);
    }
    if (email) {
        updates.push("email = ?");
        params.push(email);
        if (!email.includes('@') || !email.includes('.')) { // Basic email format check
            return res.status(400).json({ "error": "Invalid email format" });
        }
    }

    params.push(id); // Add the ID for the WHERE clause

    const sql = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

    db.run(sql, params, function (err) {
        if (err) {
            if (err.message.includes('SQLITE_CONSTRAINT_UNIQUE')) {
                return res.status(409).json({ "error": "Email already exists" });
            }
            res.status(500).json({ "error": err.message });
            return;
        }
        if (this.changes > 0) {
            res.json({ "message": "User updated successfully", "id": id });
        } else {
            res.status(404).json({ "message": "User not found or no changes made" });
        }
    });
});

// 5. DELETE a user
app.delete('/users/:id', (req, res) => {
    const id = req.params.id;
    db.run('DELETE FROM users WHERE id = ?', id, function (err) {
        if (err) {
            res.status(500).json({ "error": err.message });
            return;
        }
        if (this.changes > 0) { // Check if any rows were actually deleted
            res.json({ "message": "User deleted successfully", "id": id });
        } else {
            res.status(404).json({ "message": "User not found" });
        }
    });
});

// Default route for any other requests (404 Not Found)
app.use((req, res) => {
    res.status(404).send("404: Not Found");
});



// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

