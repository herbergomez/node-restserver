const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { unique } = require('underscore');
let Schema = mongoose.Schema;

let categoriaEsquema = new Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es obligatorio'],
        unique: true
    },
    descripcion: {
        type: String,
        require: false
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        require: [true, 'El usuario es obligatorio']
    }
});
//Se agrega la validacion de tipo unica al esquema
categoriaEsquema.plugin(uniqueValidator, { message: '{PATH} debe ser unica' });
//Se exporta el modelo
module.exports = mongoose.model('Categoria', categoriaEsquema);