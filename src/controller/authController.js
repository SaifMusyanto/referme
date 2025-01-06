const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { generateToken } = require("../utils/jwtUtils.js");
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
      .withMessage(
        "Your password is not Strong enough, Use characters !@#$%^&*() to get strong password"
      )
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

    const token = generateToken({ email }, SECRET_KEY);

    res.status(201).json({ token });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Internal Server Error");
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: { email: email }, // Menentukan kondisi pencarian
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = generateToken({ email }, SECRET_KEY);
    res.json({ token });
  } else {
    res.status(401).send("Invalid credentials");
  }
};

module.exports = {
  register,
  login,
};
