const assignChecksum = require("../routes/cheksum");
const axios = require("axios");
const boom = require('@hapi/boom'); 
class ServicesBilling {
  async billing(ref, res) {
    try {
      let wompi = [];

      let DataBerry = [];
      const response = ref;
      const referenceType = response.data.transaction.reference;

      if (referenceType.includes("bfs")) {
        const respuesta = {
          amount_in_cents: response.amount_in_cents,
          reference: response.reference,
          Currency: response.Currency,
          payment_method_type: response.payment_method_type,
          status: response.status,
          checksum: response.checksum,
        };

        wompi.push(respuesta);

        //llamado a la funcion de validacion de cheksum
        const checksum = await assignChecksum(response);

        console.log(JSON.stringify(response));

        //Validacion para facturacion
        if (response.signature.checksum === checksum) {
          const Status = response.data.transaction.status;
          try {
            const Ref = response.data.transaction.reference;

            const URL_BERRY_GET = `https://nexyapp-f3a65a020e2a.herokuapp.com/zoho/v1/console/verificar_pedido_Report?where=Referencia=="${Ref}"`;

            var Pedido = [];

            await axios.get(URL_BERRY_GET).then((res) => {
              Pedido = res.data;
            });

            if (Pedido.length > 0) {
              const URL_PATCH = `https://nexyapp-f3a65a020e2a.herokuapp.com/zoho/v1/console/verificar_pedido_Report/${Pedido[0].ID}`;
              const Estado = {
                Estado: Status,
              };

              await axios.patch(URL_PATCH, Estado).then((res) => {
                console.log(`status update to ${Status}`);
              });
            }
          } catch (err) {
            res.sendStatus(422);
            console.error("Patch status faild", err);
            // throw boom.badData(`Status: ${Status}`); 
          }

          if (response.data.transaction.status === "APPROVED") {
            const Ref = response.data.transaction.reference;

            //URL para la busqueda de los productos en zoho
            const URL_BERRY_GET = `https://nexyapp-f3a65a020e2a.herokuapp.com/zoho/v1/console/verificar_pedido_Report?where=Referencia=="${Ref}"`;

            const URL_FACTURACION =
              "https://nexyapp-f3a65a020e2a.herokuapp.com/zoho/v1/console/Remision";

            //Traer los productos de berry
            await axios
              .get(URL_BERRY_GET)
              .then((res) => {
                DataBerry = res.data;
              })
              .catch((error) => {
              console.error(error); 
              res.status(422); 
              throw boom.badGateway
            });

            let Product = [];
            let productos = [];
            let Fecha = [];
            var id_client = "";
            let Total = [];
            let Direccion = [];

            if (DataBerry.length > 0) {
              productos = JSON.parse(DataBerry[0].Productos);

              DataBerry.forEach((datos) => {
                id_client = datos.ID1;
                Fecha = datos.Fecha;
                Total = datos.Total;
                Direccion = datos.Direccion;
              });

              //Recorrido a Productos para desestructurar los gramos de los productos
              productos.forEach((datos) => {
                const gramos = datos.gramos.length;
                // console.log(gramos)

                if (gramos > 1) {
                  for (let contador = 0; datos.gramos.length; ) {
                    let grams_id = datos.gramos[contador].ID_Product;

                    let grams = datos.gramos[contador].Gramos;

                    let price_product = datos.price / grams / gramos;

                    let total = price_product * grams * datos.quantity;
                    const product = {
                      Producto: grams_id,
                      Cantidad: grams,
                      // Gramos : element.gramos,
                      Precio: price_product,
                      IVA: 0,
                      Total: total,
                      Utilidad: 0,
                      Cargo_por_venta: 0,
                      Asesor: "1889220000132110360",
                    };

                    contador++;

                    Product.push(product);

                    // console.log(product)

                    if (contador == datos.gramos.length) {
                      break;
                    }
                  }
                } else {
                  let grams_id = datos.gramos[0].ID_Product;

                  let grams = datos.gramos[0].Gramos;

                  let price_product = (datos.price * datos.quantity) / grams;
                  let total = price_product * grams;
  
                  const product = {
                    Producto: grams_id,
                    Cantidad: grams,
                    Precio: price_product,
                    IVA: 0,
                    Total: total,
                    Utilidad: 0,
                    Cargo_por_venta: 0,
                    Asesor: "1889220000132110360",
                  };
  
                Product.push(product);
              }
              });

              // Informar Creación de factura
              console.log("Generating invoice...");

              const factura = {
                Cliente: id_client,
                Zona: "1889220000130974457",
                Tipo_Factura: "Contado",
                Aseso: "1889220000132110360",
                Financieras: "1889220000132747937",
                Bodega: "1889220000131977652",
                Redes2: "No",
                Fecha: Fecha,
                Vendedor: "1889220000131684707",
                Subtotal: Total,
                Total: Total,
                Iva_Total: 0,
                RT_Pago_Digital: 0,
                Otras_Deducciones: 0,
                Observacion: `Enviar a: ${Direccion}`,
                Cargo_por_ventas: 0,
                Rete_Iva: 0,
                Rete_Fuente: 0,
                Rete_Ica: 0,
                Envio: 0,
                Cuenta: "1889220000132525460",
                Item: Product,
              };
              //Creacion de la factura
              console.log(factura, referenceType); 
              // await axios 
              //   .post(URL_FACTURACION, factura) 
              //   .then((respuesta) => {
              //     console.log(
              //       "La Factura fue creada correctamente",
              //       respuesta.status
              //     );
              //   })
              //   .catch((error) => {
              //     console.error(error);
              //      res.status(422); 
              //     throw boom.badGateway("The billing isn't created"); 
              //   });
              res.sendStatus(201);
              return factura;
            } else {
              console.log("This invoice isn't berry fields order");
              res.sendStatus(422); 
              throw boom.badData("This invoice isn't berry fields order");  
            }
          } else {
            console.log(response.data);
            console.log(`Status is ${Status}`);
            res.status(422);
            throw boom.badData(`Status is ${Status}`);  
          }
        } else {
          console.log("A security problem occurred");
          res.sendStatus(451);
          throw boom.illegal("A security problem occurred")
        }
      } else {
        res.sendStatus(400);
        console.log("The reference does not correspond to berry");
        throw  boom.boomify(("The reference does not correspond to berry")); 
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500); 
      // throw boom.badImplementation("Internal Error"); 
      
    }
  }
}

module.exports = ServicesBilling;