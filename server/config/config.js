/* 
 - process.env              contiene las variables de entorno de HEROKU
*/


/**
 *  PUERTO
 *  PUERTO LOCAL : 3000.
 */

process.env.PORT = process.env.PORT || 3000;

/*
 * ENTORNO 
 * NODE_ENV es una variable que establece heroku , si no existe ,asumimos que es DEV.

 */

 process.env.NODE_ENV = process.env.NODE_ENV || 'dev'


/* BASE DE DATOS MONGO*/
let urlDB;
if( process.env.NODE_ENV === 'dev'){
    /* Base de datos local */
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    /* Base de datos prod
     * MONGO_URI se definen como variable de entorno en HEROKU.     
     * 
     */
    urlDB = process.env.MONGO_URI;

}

process.env.URL_DB = urlDB;




/**
 * JWT VENCIMIENTO TOKEN
 * 60 segundos
 * 60 minutos
 * 24 horas
 * 30 dias
 */

 process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;



 /* JWT SEED DE AUTENTICACION
 * SEED se define como variable de entorno en HEROKU.      
 *
 */

 process.env.SEED = process.env.SEED || 'SEED_INT'



 //GOOGLE CLIENT ID

 process.env.CLIENT_ID = process.env.CLIENT_ID || '220758993800-njoj16g396knov5o5k1gtnpji2h3fcbo.apps.googleusercontent.com'