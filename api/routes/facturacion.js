const controller = require("../controller/controller");
const express = require("express");
const router = express.Router();

router.post("/api", controller.newBill);

module.exports = router;
