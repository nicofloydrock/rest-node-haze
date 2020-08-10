const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client( process.env.CLIENT_ID);


const app = express()
const Usuario = require('../models/usuario')



app.post('/login' , function(req , res){
    console.log('body login' , req.body);

    /* Obtenemos la informacion de la peticion. */
    let data = req.body;

    /* Si existe un correo valido , el callback retornara un userDB en caso contrario el error */
    Usuario.findOne({email: data.email} , (err , userDB)=>{

        //evaluamos si  existe error
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }

        /* evaluamos que no exista un error a nivel de usuario. */
        if(!userDB){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Error : usuario o contraseña incorrecto'
                }
            })
        }


        /* Si la contraseña desencriptada es distinta a la contrasaña ingresada se genera un Error. */
        if(!bcrypt.compareSync(data.password , userDB.password)){
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Error : usuario o contraseña incorrecto'
                }
            })
        }

       /*   ya validado el usuario y contraseña , generamos un token jwt
         utilizando el objeto , la semilla y el tiempo de caducidad. */ 
        let token = jwt.sign({
            usuario: userDB
        }, process.env.SEED , {
            expiresIn:  process.env.CADUCIDAD_TOKEN
        })


        /* Se genera la respuesta OK */
        res.json({
            ok:true,
            usuario: userDB,
            token:token
        })


    })


});



//GOOGLE CONFIG
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();//tenemosla informacion del usuario para crear token jwt.
    const userid = payload['sub'];
    return {
        nombre:payload.name,
        email:payload.email,
        img:payload.picture,
        google:true
    }
  }
/* verify().catch(console.error);

   */
app.post('/googleAuth' , async (req , res)=>{
   let token = req.body.idtoken;
   console.log('token' , token);
   let googleUser = await verify(token)
                    .catch(e => {
                        return res.status(403).json({
                            ok:false,
                            error:e
                        })
                    });


    Usuario.findOne({email: googleUser.email}, (err, usuarioDB)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                error:err
            })
        }

        //Validamos si existe un usuario
        if(usuarioDB){
            console.log('usuario de base de datos' , usuarioDB);
            //Validamos si el usuario se creo con googleAuth.
            if(!usuarioDB.google){
                //si no se creo con googleAuth , debe iniciar con su cuenta propia
                return res.status(400).json({
                    ok:false,
                    error:{
                        message:'su cuenta correo tiene una cuenta asociada.'
                    }
                })
            }else{
                //si el usuario si se creo con googleAuth debemos renovar su token
                let token = jwt.sign({
                    usuario:usuarioDB
                },process.env.SEED,{
                    expiresIn: process.env.CADUCIDAD_TOKEN
                });

                return res.json({
                    ok:true,
                    usuario:usuarioDB,
                    token:token
                })
            }
        }else{
            //si el usuario no existe lo creamos como googleAuth
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password  = ':)';

            usuario.save((err , usuarioDB )=>{
                if(err){
                    return res.status(500).json({
                        ok:false,
                        error:err
                    })
                }

                        //si el usuario si se creo con googleAuth debemos renovar su token
                        let token = jwt.sign({
                            usuario:usuarioDB
                        },process.env.SEED,{
                            expiresIn: process.env.CADUCIDAD_TOKEN
                        });
        
                        return res.json({
                            ok:true,
                            usuario:usuarioDB,
                            token:token
                        })
            })


        }

    })

});






module.exports = app;
