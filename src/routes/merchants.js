const express = require("express");
const merchantController = require("../controller/merchantController");

const router = express.Router();

router.post("/:user_id", merchantController.create);
router.patch("/:merchant_id", merchantController.update);
router.get("/:slug", merchantController.getById);
router.get("/", merchantController.getAll);
router.delete("/:merchant_id", merchantController.remove);

module.exports = router;
