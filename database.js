// database.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydb.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the SQLite database.');
});

db.serialize(() => {
    // Create 'users' table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL
    )`);

    // Insert some dummy data if the table is empty
    db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
        if (err) {
            console.error("Error checking user count:", err.message);
            return;
        }
        if (row.count === 0) {
            const insert = 'INSERT INTO users (name, email) VALUES (?, ?)';
            db.run(insert, ['Sachin', 'sbdaingade@egmail.com']);
            db.run(insert, ['Sachin Daingade', 'sachin.daingade@gmail.com']);
            console.log("Dummy users inserted.");
        }
    });
});

// Export the database instance for use in other files
module.exports = db;