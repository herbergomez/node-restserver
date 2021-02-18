const { v4: uuidv4 } = require('uuid');
const path = require('path');

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif', 'docx', 'pdf'], carpeta = '') => {
    return new Promise((resolve, reject) => {
        const { archivo } = files;

        const nombreCortado = archivo.name.split(".");
        const extension = nombreCortado[nombreCortado.length - 1];
        // validar extensiones
        //const extensionesPemritidas = ['png', 'jpg', 'jpeg', 'gif', 'docx', 'pdf']

        if (!extensionesValidas.includes(extension)) {
            return reject(`La extension ${extension} no esta permitida`);
        }
        //console.log(extension);

        const nombreTemporal = uuidv4() + "." + archivo.name;

        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemporal);

        archivo.mv(uploadPath, (err) => {
            if (err) {
                return reject(err);
            }

            resolve(nombreTemporal);
        });
    });

}


module.exports = {
    subirArchivo
}