const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: "",
  database: "signup"
});

let userId = null; 

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

app.listen(8081, () => {
  console.log('Server is listening on port 8081');
});

app.post('/signup', (req, res) => {
  console.log("Received signup request:", req.body); 
  const sql = "INSERT INTO login (`name`, `email`, `password`) VALUES (?)";
  const values = [
    req.body.name,
    req.body.email,
    req.body.password
  ];
  
  db.query(sql, [values], (err, data) => {
    if (err) {
      console.error("Error executing query:", err); 
      return res.status(500).json({ error: "Database error" });
    } 
    res.status(201).json({ message: "Signup successful" });
  });
});

app.post('/login', (req, res) => {
  console.log("Received login request:", req.body); 
  const sql = "SELECT * FROM login WHERE `email` = ? AND `password` = ?";
  
  db.query(sql, [req.body.email, req.body.password], (err, data) => {
    if (err) {
      console.error("Error executing query:", err); 
      return res.status(500).json({ error: "Database error" });
    }
    if (data.length > 0) {
      userId = data[0].id; 
      return res.json({ message: "Success", userId: userId }); 
    } else {
      return res.json({ message: "Failed" }); 
    }
  });
});

app.post('/add-folder', (req, res) => {
  console.log("Received folder data:", req.body);
  
  const { name, color } = req.body; 

  if (!userId) {
    return res.status(403).json({ error: "User not authenticated" });
  }

  const sql = "INSERT INTO app_folders (`folder_name`, `folder_color`, `user_id`) VALUES (?)"; 
  const values = [name, color, userId]; 

  db.query(sql, [values], (err, result) => {
      if (err) {
          console.error("Error executing query:", err);
          return res.status(500).json({ error: "Database error" });
      }
      res.status(201).json({ message: "Folder added successfully", folderId: result.insertId });
  });
});

app.post('/logout', (req, res) => {
  userId = null; 
  res.json({ message: "Logout successful" });
});

app.get('/folders', (req, res) => {
    const userId = req.headers['userid']; 

    if (!userId) {
        return res.status(403).json({ error: "User not authenticated" });
    }

    const sql = "SELECT * FROM app_folders WHERE user_id = ?";
    
    db.query(sql, [userId], (err, data) => {
        if (err) {
            console.error("Error executing query:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(data); 
    });
});


