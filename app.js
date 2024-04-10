//modulos requeridos
const express = require("express");
const cors = require("cors");
const routerApi = require("./routes"); 
require("dotenv").config();
const {logErrors, errorHandler } = require('./middlewares/error.handler')

//asignacion de express a la app
const app = express();

app.use(cors());

app.use(express.json());

routerApi(app); 

app.use(logErrors); 
app.use(errorHandler); 

const port = process.env.PORT;

app.listen(port, () => console.log(`Listening on PORT: ${port}`)); 