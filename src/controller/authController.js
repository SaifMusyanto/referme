const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { generateToken } = require('../utils/jwtUtils.js');
const SECRET_KEY = process.env.SECRET_KEY || 'your_jwt_secret_key';

// exports.signup = async (req, res) => {
//   const { username, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   prisma.user.push({ username, password: hashedPassword });
//   res.status(201).send('User created');
// };

exports.login = async (req, res) => {
  const { username, password } = req.body;
  const user = prisma.user.findUnique((user) => user.username === username);
  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken({ username }, SECRET_KEY);
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
};
