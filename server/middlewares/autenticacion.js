/* Verificar Token */
const jwt = require('jsonwebtoken')
let verificaToken = (req , res , next)=>{
    let token = req.get('token');
    
    jwt.verify(token ,  process.env.SEED , (err, decoded) =>{
        if(err){
           return res.status(401).json({
                ok:false,
                err
            })
        }
            //
        req.usuario = decoded.usuario;
        next();
    })

}
/* Verificar ADMIN ROLE */
let verificarAdminRole = (req , res , next)=>{
    let usuario = req.usuario;
    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else{

       return  res.json({
            ok: false,
            err:{
                message:'El usuario no es Administrador.'
            }
        })
    }
}


module.exports = {
    verificaToken,
    verificarAdminRole

};