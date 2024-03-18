const berryServices  = require('../services/signatureServices'); 
const services = new berryServices(); 

const newSignature =  (req, res)=>{
    const signature = services.generate(req.body, res); 
  
    res.send(signature).status(201); 
}

module.exports = {
    newSignature, 
}; 