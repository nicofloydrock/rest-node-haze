const express = require('express')
const { verificaToken, verificarAdminRole } = require('../middlewares/autenticacion')
const app = express()
let fs = require("fs")



let Retiro = require('../models/solicitudRetiro')


//Mostrar todas las solicitudes de retiro
app.get('/solicitarRetiro', verificaToken, (req, res) => {

    //Paginador 
    let desde = req.query.desde || 0;
    desde = Number(desde)

    let limite = req.query.limite || 100;
    limite = Number(limite)


    Retiro.find({})
        .skip(desde)
        .limit(limite)
        .populate('usuario' , 'nombre email')
        .exec((err, RetiroDB) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    error: err
                });
            }

            Retiro.count({}, (err, cantidadRegistros) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        error: err
                    });

                }

                RetiroDB.forEach((data) =>{
    
                    data.imagen = `http://localhost:3000/${data.imagen}`;
                })

                res.json({
                    ok: true,
                    cantidadRegistros: cantidadRegistros,
                    Retiros: RetiroDB
                })
            })
        }) 
})


//Mostrar una Retiro por ID
app.get('/solicitarRetiro/:id', (req, res) => {

    let id = req.params.id;

    Retiro.findById(id)
        .exec((err, RetiroDB) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    error: err
                });
            }


            if (!RetiroDB) {
                res.status(400).json({
                    ok: false,
                    error: err,
                    message: 'ID no valido'
                });

            }
            res.json({
                ok: true,
                Retiros: RetiroDB
            })

        })
})

//Crear nueva solicitud Retiro 
app.post('/solicitarRetiro', verificaToken, (req, res) => {

    let data = req.body.solicitud;

    let retiro = new Retiro({
        nombre: data.nombre,
        rut: data.rut,
        direccion: data.direccion,
        ciudad: data.ciudad,
        telefono: data.telefono,
        tipoReciclaje: data.tipoReciclaje,
        necesitaContenedores: data.necesitaContenedores,
        cantidadAproximada: data.cantidadAproximada,
        estadoRetiro: data.estadoRetiro,
        empresaAsociada:data.empresaAsociada,
        usuario: req.usuario._id //este vendra solo si se ejecuta el middleware VerificaToken
    })

    retiro.save((err, RetiroDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error',
                error: err
            });
        }

        //Si no se creo la Retiro genero un 400
        if (!RetiroDB) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            Retiro: RetiroDB
        })

    })

})


//Actualiza una Retiro
app.put('/solicitarRetiro/:id', (req, res) => {

    let id = req.params.id;
    let data = req.body;

    let RetiroAux = {
        nombre: data.nombre,
        rut: data.rut,
        direccion: data.direccion,
        ciudad: data.ciudad,
        telefono: data.telefono,
        tipoReciclaje: data.tipoReciclaje,
        necesitaContenedores: data.necesitaContenedores,
        cantidadAproximada: data.cantidadAproximada,
        estadoRetiro: data.estadoRetiro
    }

    
    Retiro.findByIdAndUpdate(id, RetiroAux, {
        new: true,
        runValidators: true
    }, (err, RetiroDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error',
                error: err
            });
        }

        //Si no se creo la Retiro genero un 400
        if (!RetiroDB) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            Retiro: RetiroDB
        })

    })
})



//Eliminar Retiro 
app.delete('/solicitarRetiro/:id', [verificaToken, verificarAdminRole], (req, res) => {

    let id = req.params.id;

    Retiro.findByIdAndRemove(id, (err, RetiroDB) => {

        //Error de base de datos
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error',
                error: err
            });
        }

        //Si no se creo la Retiro genero un 400
        if (!RetiroDB) {
            res.status(400).json({
                ok: false,
                err: {
                    message: 'id no valido',
                }
            });
        }

        res.json({
            ok: true,
            message: 'Se elimino correctamente',
            Retiro: RetiroDB
        })


    })

})


module.exports = app;