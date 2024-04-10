const sha = require("js-sha256");

class SignatureEncypt {
  constructor() {
    this.signature = [];
  }

  async generate(ref, res) {
    try {
      const dsData = ref;
      const number = Math.random() * 100000;

      //Datos obligatorios de wompi
      const key = process.env.KEY;
      const currency = "COP";
      const comers = dsData.E_Cormers; 
      const reference = `${comers}-${number}-${dsData.Fecha}-${dsData.ID}`;
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

      this.signature.push(data);
      res.send(data); 
      return signature; 
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = SignatureEncypt;