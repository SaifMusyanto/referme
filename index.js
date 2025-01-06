const express = require("express");
const usersRoutes = require('./src/routes/users');
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require('body-parser');
const authRoutes = require('./src/routes/auth');
const { authenticateToken } = require('./src/middleware/authMiddleware');

const prisma = new PrismaClient();
const app = express();

app.use(bodyParser.json());
app.use('/auth', authRoutes);

app.get('/protected', authenticateToken, (req, res) => {
  res.send('This is a protected route');
});

dotenv.config();

const PORT = process.env.PORT;
//const minddlewareLogRequest = require('./middleware/logs');

// app.use(minddlewareLogRequest);
app.use(express.json());

app.use("/users", usersRoutes);



app.listen(PORT, () => {
  console.log("Express API running in port:  " + PORT);
});


