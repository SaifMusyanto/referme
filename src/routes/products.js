const express = require("express");
const productController = require("../controller/productController");

const router = express.Router();

router.post("/", productController.create);
router.patch("/:product_id", productController.update);
router.get("/", productController.getAll);
router.get("/:product_id", productController.getById);
router.delete("/:product_id", productController.remove);

module.exports = router;
