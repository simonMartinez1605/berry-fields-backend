//modulos requeridos
const express = require("express");
const cors = require("cors");
const routerApi = require("./routes"); 
require("dotenv").config();

//asignacion de express a la app
const app = express();

app.use(cors());

app.use(express.json());

routerApi(app); 
//Escuchar el puerto en el que se van a ejecutar los datos
const port = process.env.PORT;

app.listen(port, () => console.log(`Listening on PORT: ${port}`)); 