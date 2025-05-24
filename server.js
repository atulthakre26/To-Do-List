const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Get all todos
app.get('/todos', (req, res) => {
  db.query('SELECT * FROM todos', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Add a todo
app.post('/todos', (req, res) => {
  const { task } = req.body;
  db.query('INSERT INTO todos (task) VALUES (?)', [task], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json({ id: result.insertId, task, completed: false });
  });
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM todos WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(204);
  });
});

// Toggle complete
app.put('/todos/:id', (req, res) => {
  const { completed } = req.body;
  const id = req.params.id;
  db.query('UPDATE todos SET completed = ? WHERE id = ?', [completed, id], (err) => {
    if (err) return res.status(500).send(err);
    res.sendStatus(200);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
