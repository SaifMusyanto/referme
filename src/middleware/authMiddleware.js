const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY || 'your_jwt_secret_key';

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Mengambil token dari header
  const token = authHeader && authHeader.split(' ')[1]; // Menghapus "Bearer" dari token

  if (!token) return res.sendStatus(403); // Forbidden jika token tidak ada

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Forbidden jika token invalid
    req.user = user; // Menyimpan informasi user ke request
    next(); // Melanjutkan ke handler berikutnya
  });
};
