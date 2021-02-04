const express = require('express');
const bcript = require('bcrypt');
const { verificaToken, verificaAdminROLE } = require('../middlewares/autenticacion');
const _ = require('underscore');
const Usuario = require('../modelos/usuario');
const app = express();
const bodyParser = require('body-parser');

//middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json())

app.get('/usuario', verificaToken, (req, res) => {

    //res.json('get usuario local');
    let desde = req.query.desde || 0;
    let paginado = req.query.limite || 5;
    desde = Number(desde);
    paginado = Number(paginado);
    Usuario.find({ estado: true }, 'nombre email role img')
        .skip(desde)
        .limit(paginado)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            }
            Usuario.count({ estado: true }, (err, total) => {
                res.json({
                    ok: true,
                    usuarios,
                    total
                })
            });


        });
});

app.post('/usuario', [verificaToken, verificaAdminROLE], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcript.hashSync(body.password, 10),
        // img: body.img,
        role: body.role,
        estado: body.estado,
        google: body.google
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});
app.put('/usuario/:id', [verificaToken, verificaAdminROLE], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});
app.delete('/usuario/:id', [verificaToken, verificaAdminROLE], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['estado']);
    body.estado = false;
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })
    });
});

module.exports = app;