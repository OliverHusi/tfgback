const express = require('express');
require('dotenv').config();
const {dbConnection} = require('./db/config');

// //Creamos servidor de express
const app = express();

//DB
dbConnection();

//Lectura y parseo del body
app.use(express.json());

//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/videos', require('./routes/videos'));


//Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});