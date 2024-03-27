const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");

//Recibir datos de encriptacion para wompi

router.post("/", controller.newSignature);

module.exports = router;
