const express = require("express");

const signatureBerry = require("./sigantureBerry");
const facturacionBerry = require("./facturacion");

function routerApi(app) {

  app.use("/api/Signature", signatureBerry);
  app.use("/api/res/nidum", facturacionBerry);
}

module.exports = routerApi;
