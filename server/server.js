require('./config/config')
const mongoose = require('mongoose');
const path = require("path");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(express.static(path.resolve(__dirname, '../public')));

//console.log(path.resolve(__dirname, '../public'));
//configuracion global de rutas
app.use(require('./rutas/index'));


mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) {
        throw err;
    }
    console.log("Base de datos OLINE!");
});

app.listen(process.env.PORT, () => {
    console.log(`Escuchando en el puero: `, process.env.PORT);
});