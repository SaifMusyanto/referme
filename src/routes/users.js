const express = require("express");

const userController = require("../controller/users.js");

const router = express.Router();


// router.post("/", userController.createNewUser);
router.get("/", userController.getAllUsers);
router.get("/:idUser", userController.getUser);
router.patch("/:idUser", userController.updateUser);
router.delete('/:idUser',userController.deleteUser);

module.exports = router;
