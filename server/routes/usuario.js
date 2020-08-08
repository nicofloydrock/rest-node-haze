const express = require('express')
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express()
const Usuario = require('../models/usuario')
const {verificaToken , verificarAdminRole} = require('../middlewares/autenticacion')

app.get('/', function(req, res) {
    res.json('Hello World')
});

//obtengo 
app.get('/usuario', verificaToken, (req, res) => {
   
    let desde = req.query.desde || 0;
    desde = Number(desde)

    let limite = req.query.limite || 10;
    limite = Number(limite)


    Usuario.find({estado:true} , 'nombre email role estado google img')
    .skip(desde)
    .limit(limite)
        .exec((err , usuarios) => {
            if(err){
                return res.status(400).json({
                    ok:false,
                    error:err
                });
            }
            Usuario.count({estado:true} , (err, cantidadRegistros) => {
                res.json({
                    ok:true,
                    cantidadRegistros:cantidadRegistros,
                    usuarios:usuarios
            })
        });
    })
});

//inserto
app.post('/usuario', [verificaToken ,verificarAdminRole], (req, res)=> {
    let data = req.body;

    let usuario = new Usuario({
        nombre: data.nombre,
        email: data.email,
        password:bcrypt.hashSync(data.password ,10 ),
        img: data.img,
        role:data.role,
        estado:data.estado,
        google:data.google
    })



    usuario.save((err , usuarioDB) =>{
        if(err){
            res.status(400).json({
                ok:false,
                mensaje:'error' ,
                error:err

            });
        }


        res.json({
            ok:true,
            usuario: usuarioDB
        })

    });



});

//actualizo
app.put('/usuario/:id',[verificaToken ,verificarAdminRole] , (req, res) =>{
    let id = req.params.id;
    let body = _.pick(req.body , ['nombre' , 'email' , 'img' , 'role' , 'estado']) ;
    let option = {
        new:true,
        runValidators:true
    }

    Usuario.findByIdAndUpdate(id,body ,option, (err,usuarioDB) =>{
        if(err){
            res.status(400).json({
                ok:false,
                mensaje:'error' ,
                error:err
            });
        }
        res.json({
                id,
                ok:true,
                usuario:usuarioDB
            }); 
    });
});


app.get('/persona', verificaToken , (req, res)=>{
    res.json({
        ok:true,
        mensaje:'persona borrada '
    })
})


//delete
app.delete('/usuario/:id', [verificaToken ,verificarAdminRole] ,(req, res) => {

    let id = req.params.id;
    let cambiaEstado ={
        estado:false
    }
    let option = {
        new:true
    }
    //eliminacion fisica.
 /*    Usuario.findByIdAndRemove(id,(err , usuarioBorrado) => {
        if(err){
            res.status(400).json({
                ok:false,
                mensaje:'error' , 
                error:err

            });
        }
        if(!usuarioBorrado){
            res.status(400).json({
                ok:false,
                error:{
                    message:'Usuario no encontrado'
                }

            });
        }
        res.json({
            ok:true,
            usuario:usuarioBorrado
        })
    }) */

    //eliminacion por estado ( actualizacion...)
    Usuario.findByIdAndUpdate(id,cambiaEstado ,option, (err,usuarioDB) =>{
        if(err){
            res.status(400).json({
                ok:false,
                mensaje:'error' ,
                error:err

            });
        }

        res.json({
                id,
                ok:true,
                usuario:usuarioDB
            });
        
    });

})



module.exports = app;
