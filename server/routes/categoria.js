const express = require('express')
const { verificaToken, verificarAdminRole } = require('../middlewares/autenticacion')
const app = express()



let Categoria = require('../models/categoria')


//Mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {

    //Paginador 
    let desde = req.query.desde || 0;
    desde = Number(desde)

    let limite = req.query.limite || 10;
    limite = Number(limite)


    Categoria.find({})
        .skip(desde)
        .limit(limite)
        .sort('descripcion') //Ordena mediante un parametro de entrada en este caso descripcion. Ordena A-Z luego a-z
        .populate('usuario' , 'nombre email')//la variable usuario contiene un objectID ,
                                             // con esto resolvemos que usuario le corresponde , ademas , se indica que se quiere obtener de ese objeto
        .exec((err, categoriasDB) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    error: err
                });
            }

            Categoria.count({}, (err, cantidadRegistros) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        error: err
                    });

                }

                res.json({
                    ok: true,
                    cantidadRegistros: cantidadRegistros,
                    categorias: categoriasDB
                })
            })
        }) 
})


//Mostrar una categoria por ID
app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findById(id)
        .exec((err, categoriaDB) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    error: err
                });
            }


            if (!categoriaDB) {
                res.status(400).json({
                    ok: false,
                    error: err,
                    message: 'ID no valido'
                });

            }
            res.json({
                ok: true,
                categorias: categoriaDB
            })

        })
})

//Crear nueva Categoria 
app.post('/categoria', verificaToken, (req, res) => {

    let data = req.body;
    let categoria = new Categoria({
        descripcion: data.descripcion,
        usuario: req.usuario._id //este vendra solo si se ejecuta el middleware VerificaToken
    })


    categoria.save((err, categoriaDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error',
                error: err
            });
        }

        //Si no se creo la categoria genero un 400
        if (!categoriaDB) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

})


//Actualiza una categoria
app.put('/categoria/:id', (req, res) => {

    let id = req.params.id;
    let data = req.body;

    let categoriaAux = {
        descripcion: data.descripcion,

    }
    Categoria.findByIdAndUpdate(id, categoriaAux, {
        new: true,
        runValidators: true
    }, (err, categoriaDB) => {
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error',
                error: err
            });
        }

        //Si no se creo la categoria genero un 400
        if (!categoriaDB) {
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })
})



//Eliminar categoria 
app.delete('/categoria/:id', [verificaToken, verificarAdminRole], (req, res) => {

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        //Error de base de datos
        if (err) {
            res.status(500).json({
                ok: false,
                mensaje: 'error',
                error: err
            });
        }

        //Si no se creo la categoria genero un 400
        if (!categoriaDB) {
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
            categoria: categoriaDB
        })


    })

})


module.exports = app;