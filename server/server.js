require('./config/config');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose');



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

//Configuracion de rutas globales 
app.use(require('./routes/index'))
mongoose.connect(process.env.URL_DB, {useNewUrlParser:true , useCreateIndex:true},
(err , res) =>{
    if(err) throw err;
    console.log('Conexion Exitosa');
});


app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}`);
});
