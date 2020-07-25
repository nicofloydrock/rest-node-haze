/**
 *  PUERTO
 *  
 */

process.env.PORT = process.env.PORT || 3000;

/*
 * ENTORNO
 * mongo pass 9PDttSwJfNUdpDun
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
    urlDB = 'mongodb://example:example1234@ds151124.mlab.com:51124/example';

}

process.env.URL_DB = urlDB;
