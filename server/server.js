require('./config/config');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')




// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())





app.get('/', function(req, res) {
    res.json('Hello World')
});

//obtengo 
app.get('/usuario', function(req, res) {
    res.json(" get usuario");
});

//inserto
app.post('/usuario', function(req, res) {
    let usuario = req.body;
    if (usuario.nombre == undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre no puede ser vacio'
        });

    } else {
        res.json({
            usuario
        });
    }

});

//actualizo
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({
        id,
        prueba: "prueba"
    });
});
//delete
app.delete('/usuario', function(req, res) {
    res.json("delete usuario");
})



app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puerto ${process.env.PORT}`);
});