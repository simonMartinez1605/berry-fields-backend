const express = require("express");

const signatureBerry = require("./sigantureBerry");
const facturacionBerry = require("./facturacion");

function routerApi(app) {
  const router = express.Router(); 

  app.use('/api/v1', router); 

  router.use("/api/Signature", signatureBerry);
  router.use("/api/res/nidum", facturacionBerry);
}

module.exports = routerApi;
