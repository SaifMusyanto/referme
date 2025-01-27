const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const SECRET_KEY = process.env.SECRET_KEY || "your_jwt_secret_key";

const register = async (req, res) => {
  const { username, email, phone_number, password, role_id } = req.body;

  const userValidation = [
    body("username").isString().notEmpty().withMessage("Username is required"),
    body("email")
      .isEmail()
      .withMessage("Invalid email format")
      .notEmpty()
      .withMessage("Email is required"),
    body("phone_number")
      .isString()
      .notEmpty()
      .withMessage("Phone number is required"),
    body("password")
      .isStrongPassword()
      .withMessage("Password must be at least 8 characters, 1 Uppercase, 1 character")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage(
        "Password must be at least 8 characters, 1 Uppercase, 1 character"
      ),
  ];

  await Promise.all(userValidation.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (existingUser) {
    return res.status(400).send("Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10); // 10 adalah salt rounds

  try {
    const newUser = await prisma.user.create({
      data: {
        username: username,
        email: email,
        phone_number: phone_number,
        password: hashedPassword,
        role_id: role_id,
      },
    });

    const token = jwt.sign({ id: newUser.user_id, email: newUser.email }, SECRET_KEY, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Internal Server Error");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.user_id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = (req, res) => {
  // Invalidate the token by setting it to null or an empty string
  res.json({ token: null, message: "Successfully logged out" });
};

module.exports = {
  register,
  login,
  logout
};
