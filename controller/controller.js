const berryServices = require('../services/signatureServices'); 
const services = new berryServices(); 

const newSignature = async (req, res)=>{
    await services.generate(req.body, res); 
  
    res.status(201); 
}

const newBill = async ()=>{
    
}

module.exports = {
    newSignature, 
}; 