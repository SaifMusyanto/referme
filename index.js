const express = require("express");
const usersRoutes = require('./src/routes/users');
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

dotenv.config();

const PORT = process.env.PORT;
//const minddlewareLogRequest = require('./middleware/logs');

// app.use(minddlewareLogRequest);
app.use(express.json());

app.use("/users", usersRoutes);



app.listen(PORT, () => {
  console.log("Express API running in port:  " + PORT);
});


