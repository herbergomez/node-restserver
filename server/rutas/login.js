const express = require('express');
const bcript = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
});
//================================
//Configuraciones de Google
//=================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();
    return {
        nombres: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
};
//verify().catch(console.error);

app.post('/google', async(req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token).catch(err => {
        return res.status(403).jsonp({
            op: false,
            err: 'Credenciales invalidas'
        });
    });

    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        if (!usuarioDB) {
            //creamos el usuario
            let usuario = new Usuario();
            usuario.nombre = googleUser.nombres;
            usuario.email = googleUser.email;
            usuario.google = true;
            usuario.img = googleUser.img;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        error: err
                    });
                }
                let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                });
                return res.json({
                    ok: true,
                    token,
                    usuario: usuarioDB
                });
            });
        } else {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'Debe usar su autenticacion normal'
                    }
                });
            } else {
                let token = jwt.sign({ usuario: usuarioDB }, process.env.SEED, {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                });

                return res.json({
                    ok: true,
                    token,
                    usuario: usuarioDB
                });
            }
        }
    })
});





module.exports = app;