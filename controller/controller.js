const berryServices = require("../services/signatureServices");
const ServicesBilling = require("../services/BillingServices");
const servicesSignature = new berryServices();
const billing = new ServicesBilling();

const newSignature = async (req, res) => {
  await servicesSignature.generate(req.body, res);
};

const newBill = async (req, res) => {
  await billing.billing(req.body, res);
};

module.exports = {
  newSignature,
  newBill,
};
