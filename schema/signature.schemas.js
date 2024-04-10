const Joi = require('joi'); 

const amount = Joi.number(); 
const ID = Joi.number(); 
const Fecha = Joi.string(); 
const E_Cormers = Joi.string(); 

const createSignature = Joi.object({
    amount : amount.required(), 
    ID: ID.required(), 
    Fecha : Fecha.required(), 
    E_Cormers : E_Cormers.required() 
}); 

module.exports = createSignature; 