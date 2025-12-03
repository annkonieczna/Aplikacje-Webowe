const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const { sequelize, Order } = require('./models');
const auth = require('./auth');

const app = express();
app.use(bodyParser.json());

const PORT = 3002;

// init DB
sequelize.sync();

// GET orders of user
app.get('/api/orders/:userId', auth, async (req, res) => {
  if (parseInt(req.params.userId) !== req.user.id)
    return res.status(403).json({ error: "Brak dostępu" });

  const orders = await Order.findAll({ where: { userId: req.user.id } });
  res.json(orders);
});

// CREATE order
app.post('/api/orders', auth, async (req, res) => {
  const { bookId, quantity } = req.body;

  // check book exists via Books service
  const check = await fetch(`http://localhost:3001/api/books/${bookId}`);
  if (check.status !== 200)
    return res.status(400).json({ error: "bookId nie istnieje" });

  const o = await Order.create({
    userId: req.user.id,
    bookId,
    quantity
  });

  res.json({ id: o.id });
});

// UPDATE
app.patch('/api/orders/:id', auth, async (req, res) => {
  const o = await Order.findByPk(req.params.id);
  if (!o) return res.status(404).json({ error: "Nie ma zamówienia" });
  if (o.userId !== req.user.id) return res.status(403).json({ error: "Brak dostępu" });

  const { quantity } = req.body;
  if (quantity) o.quantity = quantity;
  await o.save();

  res.json({ ok: true });
});

// DELETE
app.delete('/api/orders/:id', auth, async (req, res) => {
  const o = await Order.findByPk(req.params.id);
  if (!o) return res.status(404).json({ error: "Nie ma zamówienia" });
  if (o.userId !== req.user.id) return res.status(403).json({ error: "Brak dostępu" });

  await o.destroy();
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`Orders service running on ${PORT}`));
