const controller = require("../controller/controller");
const express = require("express");
const router = express.Router();

router.post("/", controller.newBill);

module.exports = router;
