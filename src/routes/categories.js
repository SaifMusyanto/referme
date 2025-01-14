const express = require("express");
const categoryController = require("../controller/categoryController");

const router = express.Router();

router.post("/", categoryController.create);
router.get("/:merchant_id", categoryController.getAll);
router.get("/detail/:category_id", categoryController.getById);
router.patch("/:category_id", categoryController.update);
router.delete("/:category_id", categoryController.remove);

module.exports = router;
