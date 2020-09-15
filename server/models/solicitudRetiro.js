const mongoose = require('mongoose');
let Schema = mongoose.Schema;




let retiroSchema = new Schema({
    nombre: {
        type:String ,
        required:[true , 'El campo es requerido']
    },
    rut: {
        type:String ,
        required:[true , 'El campo es requerido']
    },
    direccion: {
        type:String ,
        required:[true , 'El campo es requerido']
    },
    ciudad: {
        type:String ,
        required:[true , 'El campo es requerido']
    },
    telefono: {
        type:String ,
        required:[true , 'El campo es requerido']
    },
    tipoReciclaje:{
        type:String,
        required:[true,'el campo es requerido']
    },
    cantidadAproximada:{
        type:String,
        required:[true,'el campo es requerido']
    },
    empresaAsociada:{
        type:String,
        required:[true,'el campo es requerido']
    },
    necesitaContenedores:{
        type:Boolean
    },
    estadoRetiro:{
        type:String
    },
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'Usuario'
    }
});


module.exports = mongoose.model('Retiro' , retiroSchema);