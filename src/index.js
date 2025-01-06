const express = require("express");
const usersRoutes = require("./routes/users");
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const { authenticateToken } = require("./middleware/authMiddleware");
const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
dotenv.config();
app.use(express.json());

app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.get("/protected", authenticateToken, (req, res) => {
  res.send("This is a protected route");
});

app.listen(PORT, () => {
  console.log("Express API running in port:  " + PORT);
});

//const minddlewareLogRequest = require('./middleware/logs');
// app.use(minddlewareLogRequest);
