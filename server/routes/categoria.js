const express = require('express')
const {verificaToken} = require('../middlewares/autenticacion')
const app = express()



let Categoria = require('../models/categoria')


//Mostrar todas las categorias
app.get('/categoria',verificaToken , (req , res) =>{

    //Paginador 
    let desde = req.query.desde || 0;
    desde = Number(desde)

    let limite = req.query.limite || 10;
    limite = Number(limite)


    Categoria.find()
             .skip(desde)
             .limit(limite)
                .exec((err , categoriasDB)=> {
                    if(err){
                        res.status(500).json({
                            ok:false,
                            error:err
                        });
                    }

                    Categoria.count({} , (err,cantidadRegistros)=>{
                        if(err){
                            res.status(500).json({
                                ok:false,
                                error:err
                            });

                        }

                        res.json({
                            ok:true,
                            cantidadRegistros:cantidadRegistros,
                            categorias:categoriasDB
                        })
                    })
                })
})


//Mostrar una categoria por ID
app.get('/categoria/:id' , (req , res) => {

})

//Crear nueva Categoria 
app.post('/categoria' ,verificaToken , (req , res)=>{
    let data = req.body;
    let categoria = new Categoria({
        descripcion:data.descripcion,
        usuario:req.usuario._id
    })


    categoria.save((err,categoriaDB)=>{
        if(err){
            res.status(500).json({
                ok:false,
                mensaje:'error' ,
                error:err
            });
        }

        if(!categoriaDB){
            res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok:true,
            categoria: catogriaDB
        })

    })

})


//Actualiza una categoria
app.put('/categoria/:id' , (req , res)=>{

})



//Eliminar categoria 
app.delete('/categoria/:id' , (req, res)=>{
    
})


module.exports = app;