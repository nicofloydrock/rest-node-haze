const mongoose = require('mongoose');
let Schema = mongoose.Schema;




let publicacionSchema = new Schema({
    texto: {
        type:String ,
        required:[true , 'El campo es requerido']
    },
    imagen: {
        type:String ,
        required:[true , 'El campo es requerido']
    },
    participantes: {
        type: Array ,
    },
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'Usuario'
    }
});


module.exports = mongoose.model('Publicacion' , publicacionSchema);