const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const app = express()
const Usuario = require('../models/usuario')



app.post('/login' , function(req , res){
    console.log('body login' , req.body);
    let data = req.body;

    //Si existe un correo valido , el callback retornara un userDB en caso contrario el error
    Usuario.findOne({email: data.email} , (err , userDB)=>{

        //evaluamos si  existe error
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        //evaluamos que no exista un error a nivel de usuario.
        if(!userDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Error : usuario o contraseña incorrecto'
                }
            })
        }


        if(!bcrypt.compareSync(data.password , userDB.password)){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Error : usuario o contraseña incorrecto'
                }
            })
        }

        let token = jwt.sign({
            usuario: userDB
        }, process.env.SEED , {
            expiresIn:  process.env.CADUCIDAD_TOKEN
        })


        res.json({
            ok:true,
            usuario: userDB,
            token:token
        })


    })
})






module.exports = app;
