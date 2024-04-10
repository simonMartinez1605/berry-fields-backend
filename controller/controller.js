const berryServices = require("../services/signatureServices");
const ServicesBilling = require("../services/BillingServices");
const boom  = require("@hapi/boom");
const servicesSignature = new berryServices();
const billing = new ServicesBilling();

const newSignature = 
  async (req, res) => {

  try {
    await servicesSignature.generate(req.body, res);
  } catch (error) {
    throw boom.badGateway(error); 
  }

};

const newBill = async (req, res) => {

  try {
    await billing.billing(req.body, res);
  } catch (error) {
    throw boom.badGateway(error); 
  }

};

module.exports = {
  newSignature,
  newBill,
};