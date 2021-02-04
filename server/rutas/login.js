const express = require('express');
const bcript = require('bcrypt');
const jwt = require('jsonwebtoken');

const Usuario = require('../modelos/usuario');
const app = express();


app.post('/login', (req, res) => {
    let body = req.body;
    //console.log("email: ", body.email);
    //console.log("password: ", body.password);
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'El usuario no fue encontrado en la BD'
                }
            });
        }
        let pass = body.password;

        if (!bcript.compareSync(pass, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'La password es incorrecta'
                }
            });
        }
        let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, {
            expiresIn: process.env.CADUCIDAD_TOKEN
        });

        res.json({
            ok: true,
            token,
            usuario: usuarioDB
        });
    })
})







module.exports = app;