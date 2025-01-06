const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const users = require('../');
const { generateToken } = require('../utils/jwtUtils');
const SECRET_KEY = process.env.SECRET_KEY || 'your_jwt_secret_key';

exports.signup = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).send('User created');
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((user) => user.username === username);
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken({ username }, SECRET_KEY);
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
};
