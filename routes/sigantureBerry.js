const express = require('express'); 

const router = express.Router(); 
const sha = require("js-sha256").sha256;
const DATA =[]

//Recibir datos de encriptacion para wompi 

router.post('/', (req, res)=>{
    try {
        const dsData = req.body;
        const number = Math.random() * 100000;
    
        //Datos obligatorios de wompi
        const key = process.env.KEY;
        const currency = "COP";
        const reference = `bfs-${number}-${dsData.Fecha}-${dsData.ID}`;
        const amount = dsData.amount * 100;
        const params = reference + amount + currency + key;
    
        //utilizar sha256 para encriptar los datos y hacer la signature
        const signature = sha(params);
    
        const data = [
          {
            key: process.env.KEY,
            currency: currency,
            reference: reference,
            amount: amount,
            signature: signature,
            public_key: process.env.PUBLIC_KEY,
          },
        ];
    
        DATA.push(data);
        res.status(200).send(data);
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Internal server error" });
      }
})


module.exports = router; 