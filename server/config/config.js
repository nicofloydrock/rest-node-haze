
//process.env contiene las variables de entorno de HEROKU
/**
 *  PUERTO
 *  
 */

process.env.PORT = process.env.PORT || 3000;

/*
 * ENTORNO
 * mongo 
 */

//NODE_ENV es una variable que establece heroku , si no existe ,asumimos que es DEV.
 process.env.NODE_ENV = process.env.NODE_ENV || 'dev'



/* BASE DE DATOS */
let urlDB;
if( process.env.NODE_ENV === 'dev'){
    // base de datos local
    urlDB = 'mongodb://localhost:27017/cafe';
}else{
    //base de datos prod
    urlDB = process.env.MONGO_URI;

}

process.env.URL_DB = urlDB;
