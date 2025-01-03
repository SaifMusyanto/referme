const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Controller untuk mendapatkan semua user
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany(); // Mengambil semua data dari tabel User
    console.log('Success fetch all users');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Controller untuk menambahkan user baru
const createNewUser = async (req, res) => {
  try {
    const { username, email, phone_number, password } = req.body;

    // Cek apakah email sudah ada di database
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Buat user baru jika email belum terdaftar
    const newUser = await prisma.user.create({
      data: { username, email, phone_number, password },
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

const updateUser = async (req, res) => {
  const { username, phone_number, password } = req.body;
    try {
    const newProfile = await prisma.user.update({
      where: { user_id: parseInt(req.params.idUser) },
      data: {
        username: username,
        phone_number: phone_number,
        password: password,
      },
    });

    res.status(200).json({
      message : "Update user success",
      data: newProfile
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
}


const deleteUser = async (req,res) => {
    try {
    const newProfile = await prisma.user.delete({
      where: { user_id: parseInt(req.params.idUser) },
    });

    res.status(201).json({
      message : "Delete user success",
      data: newProfile
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
}

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
