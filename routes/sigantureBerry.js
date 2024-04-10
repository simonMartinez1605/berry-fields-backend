const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");

const validatorHanlder = require('..//middlewares/validator.handler'); 
const schema = require('../schema/signature.schemas'); 


//Recibir datos de encriptacion para wompi

router.post("/",
    validatorHanlder(schema, 'body'), 
    controller.newSignature
);

module.exports = router;