const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sequelize, User } = require('./models');

const app = express();
app.use(bodyParser.json());

const PORT = 3003;
const JWT_SECRET = "SUPER_SECRET_JWT_KEY";

// init DB
sequelize.sync();

// REGISTER
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const u = await User.create({ email, password: hashed });
  res.json({ id: u.id });
});

// LOGIN
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const u = await User.findOne({ where: { email } });
  if (!u) return res.status(401).json({ error: "Złe dane" });

  const ok = await bcrypt.compare(password, u.password);
  if (!ok) return res.status(401).json({ error: "Złe dane" });

  const token = jwt.sign({ id: u.id, email: u.email }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

app.listen(PORT, () => console.log(`Users service running on ${PORT}`));