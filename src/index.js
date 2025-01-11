const express = require("express");
const usersRoutes = require("./routes/users");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const { authenticateToken } = require("./middleware/authMiddleware");
const badgesRoute = require("./routes/badges");
const productsRoute = require("./routes/products");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT;

app.use(bodyParser.json());
dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/badges", badgesRoute);
app.use("/products", productsRoute);
app.get("/protected", authenticateToken, (req, res) => {
  res.send("This is a protected route");
});

app.listen(PORT, () => {
  console.log("Express API running in port:  " + PORT);
});

//const minddlewareLogRequest = require('./middleware/logs');
// app.use(minddlewareLogRequest);
