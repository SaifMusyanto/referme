const express = require("express");
const productController = require("../controller/productController");

const router = express.Router();

router.post("/create", productController.create);
router.post("/search", productController.search);
router.get("/detail/:product_id", productController.getById);
router.get("/:merchant_id", productController.getByMerchant);
router.get("/:merchant_id/:category_id", productController.getAllByCategory);
router.patch("/:product_id", productController.update);
router.delete("/:product_id", productController.remove);


module.exports = router;
