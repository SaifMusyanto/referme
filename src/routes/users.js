const express = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const userController = require("../controller/users.js");

const router = express.Router();


// router.post("/", userController.createNewUser);
router.get("/", userController.getAllUsers);
router.get("/:idUser", authenticateToken, userController.getUser);
router.patch("/:idUser", userController.updateUser);
router.delete('/:idUser', userController.deleteUser);

module.exports = router;
