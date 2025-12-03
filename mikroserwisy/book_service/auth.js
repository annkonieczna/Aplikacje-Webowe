const jwt = require('jsonwebtoken');

const JWT_SECRET = "SUPER_SECRET_JWT_KEY";

module.exports = function (req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Brak tokenu" });

  const [type, token] = header.split(" ");
  if (type !== "Bearer") return res.status(401).json({ error: "Zły format tokenu" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    res.status(401).json({ error: "Niepoprawny token" });
  }
}