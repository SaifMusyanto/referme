const express = require("express");
const usersRoutes = require('./routes/users');
const dotenv = require("dotenv");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();

dotenv.config();

//const minddlewareLogRequest = require('./middleware/logs');

// app.use(minddlewareLogRequest);
app.use(express.json());

app.use("/users", usersRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Express API running in port:  " + PORT);
});

app.get("/", (req, res) => {
    res.send("welcome");
});

app.get("/role")










app.post("/", (req, res) => {
    res.send("hello POST methode ");
});


