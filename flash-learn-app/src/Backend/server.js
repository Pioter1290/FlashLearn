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
  const sql = "INSERT INTO login (name, email, password) VALUES (?)";
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
  const sql = "SELECT * FROM login WHERE email = ? AND password = ?";
  
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

  const sql = "INSERT INTO app_folders (folder_name, folder_color, user_id) VALUES (?)"; 
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


app.post('/add-flashcard', (req, res) => {
  console.log("Received add-flashcard request:", req.body); 
  const { question, answer, folder_id } = req.body;

  if (!question || !answer || !folder_id) {
    return res.status(400).json({ error: "Question, answer, and folder_id are required" });
  }

  const sql = "INSERT INTO flashcards (flashcard_question, flashcard_answer, folder_id) VALUES (?)";
  const values = [question, answer, folder_id];
  
  db.query(sql, [values], (err, data) => {
    if (err) {
      console.error("Error executing query:", err); 
      return res.status(500).json({ error: "Database error" });
    } 
    res.status(201).json({ message: "Flashcard added successfully", flashcardId: data.insertId });
    
  });
});

app.delete('/delete-flashcard/:id', (req, res) => {
  const flashcardId = req.params.id;

  console.log("Received delete-flashcard request:", flashcardId);

  if (!flashcardId) {
    return res.status(400).json({ error: "Flashcard ID is required" });
  }

  const sql = "DELETE FROM flashcards WHERE flashcard_id = ?";
  const values = [flashcardId];

  db.query(sql, values, (err, data) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database error" });
    }

    if (data.affectedRows === 0) {
      return res.status(404).json({ error: "Flashcard not found" });
    }

    res.status(200).json({ message: "Flashcard deleted successfully" });
  });
});

app.get('/flashcards', (req, res) => {
  const folderId = req.query.folder_id; 
  console.log("Received request for folder_id:", folderId); 

  if (!folderId) {
    return res.status(400).json({ error: "Folder ID is required" });
  }

  const sql = "SELECT * FROM flashcards WHERE folder_id = ?";
  
  db.query(sql, [folderId], (err, data) => {
    if (err) {
      console.error("Error executing query:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(data); 
  });
});


app.delete('/delete-folder/:id', (req, res) => {
  const folderID = req.params.id;

  console.log("Received delete-folder request:", folderID);

  if (!folderID) {
    return res.status(400).json({ error: "Folder ID is required" });
  }
  db.beginTransaction((err) => {
    if (err) {
      console.error("Error starting transaction:", err);
      return res.status(500).json({ error: "Database error" });
    }

    const deleteFlashcardsSql = "DELETE FROM flashcards WHERE folder_id = ?";
    db.query(deleteFlashcardsSql, [folderID], (err, result) => {
      if (err) {
        return db.rollback(() => {
          console.error("Error deleting flashcards:", err);
          res.status(500).json({ error: "Error deleting flashcards" });
        });
      }

      const deleteFolderSql = "DELETE FROM app_folders WHERE folder_id = ?";
      db.query(deleteFolderSql, [folderID], (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.error("Error deleting folder:", err);
            res.status(500).json({ error: "Error deleting folder" });
          });
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              console.error("Error committing transaction:", err);
              res.status(500).json({ error: "Error committing transaction" });
            });
          }

          res.status(200).json({ message: "Folder and related flashcards deleted successfully" });
        });
      });
    });
  });
});
