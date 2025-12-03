const express = require('express');
const bodyParser = require('body-parser');
const { sequelize, Book } = require('./models');
const auth = require('./auth');

const app = express();
app.use(bodyParser.json());

const PORT = 3001;

// init DB
sequelize.sync();

// PUBLIC
app.get('/api/books', async (req, res) => {
  res.json(await Book.findAll());
});

app.get('/api/books/:id', async (req, res) => {
  const b = await Book.findByPk(req.params.id);
  if (!b) return res.status(404).json({ error: "Nie ma takiej książki" });
  res.json(b);
});

// PROTECTED
app.post('/api/books', auth, async (req, res) => {
  const { title, author, year } = req.body;
  const b = await Book.create({ title, author, year });
  res.json({ id: b.id });
});

app.delete('/api/books/:id', auth, async (req, res) => {
  const b = await Book.findByPk(req.params.id);
  if (!b) return res.status(404).json({ error: "Nie ma takiej książki" });
  await b.destroy();
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Books service running on ${PORT}`));
