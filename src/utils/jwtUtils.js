const jwt = require('jsonwebtoken');

exports.generateToken = (payload, secretKey) => {
  return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
