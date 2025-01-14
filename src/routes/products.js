const express = require("express");
const productController = require("../controller/productController");

const router = express.Router();

router.post("/", productController.create);
router.get("/:category_id", productController.getAllByCategory);
router.get("/detail/:product_id", productController.getById);
router.patch("/:product_id", productController.update);
router.delete("/:product_id", productController.remove);

module.exports = router;
