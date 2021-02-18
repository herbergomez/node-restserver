const dbValidator = require('./db-validators');
const generarJWT = require('./generar-jwt');
const googleVeriry = require('./google-verify');
const suirArchivo = require('./subir-archivo');

//Exportamos todo el contenido de los archivos
module.exports = {
    ...dbValidator,
    ...generarJWT,
    ...googleVeriry,
    ...suirArchivo
}