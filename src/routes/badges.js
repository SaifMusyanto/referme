const express = require("express");
const badgeController = require("../controller/badgeController");

const router = express.Router();
// console.log("test")
router.post("/", badgeController.create);
router.get("/", badgeController.getAll);
router.patch("/:badge_id", badgeController.update);
router.delete("/:badge_id", badgeController.remove);

module.exports = router;
