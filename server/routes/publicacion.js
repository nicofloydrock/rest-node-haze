const express = require('express')
const { verificaToken, verificarAdminRole } = require('../middlewares/autenticacion')
const app = express()
let fs = require("fs")



let Publicacion = require('../models/publicacion')


//Mostrar todas las Publicacions
app.get('/publicaciones', verificaToken, (req, res) => {

    //Paginador 
    let desde = req.query.desde || 0;
    desde = Number(desde)

    let limite = req.query.limite || 100;
    limite = Number(limite)


    Publicacion.find({})
        .skip(desde)
        .limit(limite)
        .populate('usuario' , 'nombre email')
        .exec((err, PublicacionsDB) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    error: err
                });
            }

            Publicacion.count({}, (err, cantidadRegistros) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        error: err
                    });

                }

                PublicacionsDB.forEach((data) =>{
    
                    data.imagen = `http://localhost:3000/${data.imagen}`;
                })

                res.json({
                    ok: true,
                    cantidadRegistros: cantidadRegistros,
                    Publicaciones: PublicacionsDB
                })
            })
        }) 
})


//Mostrar una Publicacion por ID
app.get('/Publicacion/:id', (req, res) => {

    let id = req.params.id;

    Publicacion.findById(id)
        .exec((err, PublicacionDB) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    error: err
                });
            }


            if (!PublicacionDB) {
                res.status(400).json({
                    ok: false,
                    error: err,
                    message: 'ID no valido'
                });

            }
            res.json({
                ok: true,
                Publicacions: PublicacionDB
            })

        })
})

//Crear nueva Publicacion 
app.post('/Publicacion', verificaToken, (req, res) => {

    let data = req.body;

    let publicacion = new Publicacion({
        texto: data.texto,
        imagen: '',
        participantes: data.participantes,
        usuario: req.usuario._id //este vendra solo si se ejecuta el middleware VerificaToken
    })
    let error = false;
    let nombreArchivo = `upload/${Math.random().toString()}.jpg`;
    if(data.imagen){
        let imagen = data.imagen;
        fs.writeFile('public/' + nombreArchivo , imagen , 'base64',(err)=>{
            console.log('archivo ', nombreArchivo);
            if(err){
                error = true;
            }
        })
    }
    if(!error){
        publicacion.imagen = nombreArchivo;
    }else{
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error al cargar archivo',
                error: err
            });
        }  
    }

    publicacion.save((err, PublicacionDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error',
                error: err
            });
        }

        //Si no se creo la Publicacion genero un 400
        if (!PublicacionDB) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            Publicacion: PublicacionDB
        })

    })

})


//Actualiza una Publicacion
app.put('/Publicacion/:id', (req, res) => {

    let id = req.params.id;
    let data = req.body;

    let PublicacionAux = {
        texto: data.descripcion,
        imagen: data.imagen,
        participantes: data.participantes
    }

    
    Publicacion.findByIdAndUpdate(id, PublicacionAux, {
        new: true,
        runValidators: true
    }, (err, PublicacionDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error',
                error: err
            });
        }

        //Si no se creo la Publicacion genero un 400
        if (!PublicacionDB) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            Publicacion: PublicacionDB
        })

    })
})



//Eliminar Publicacion 
app.delete('/Publicacion/:id', [verificaToken, verificarAdminRole], (req, res) => {

    let id = req.params.id;

    Publicacion.findByIdAndRemove(id, (err, PublicacionDB) => {

        //Error de base de datos
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error',
                error: err
            });
        }

        //Si no se creo la Publicacion genero un 400
        if (!PublicacionDB) {
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
            Publicacion: PublicacionDB
        })


    })

})


module.exports = app;