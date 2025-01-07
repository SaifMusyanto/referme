const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { body, validationResult } = require("express-validator");

// Controller untuk mendapatkan semua user
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany(); // Mengambil semua data dari tabel User
    console.log("Success fetch all users");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// untuk mendapatkan user berdasarkan ID
const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { user_id: parseInt(req.params.idUser) }}); 
    console.log("Success fetch requested user");
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

const updateUser = async (req, res) => {
  const { username, phone_number } = req.body;

  const updateValidation = [
    body("username").isString().withMessage("Username must be a string"),
    body("phone_number")
      .isString()
      .withMessage("Phone number must be a string"),
  ];

  await Promise.all(updateValidation.map((validation) => validation.run(req)));

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newProfile = await prisma.user.update({
      where: { user_id: parseInt(req.params.idUser) },
      data: {
        username: username,
        phone_number: phone_number,
      },
    });

    res.status(200).json({
      message: "Update user success",
      data: newProfile,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const newProfile = await prisma.user.delete({
      where: { user_id: parseInt(req.params.idUser) },
    });

    res.status(201).json({
      message: "Delete user success",
      data: newProfile,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
