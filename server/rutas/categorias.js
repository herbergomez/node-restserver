const express = require('express');
const _ = require('underscore');
const { verificaToken, verificaAdminROLE } = require('../middlewares/autenticacion');

const Categoria = require('../modelos/categoria');
const app = express();
const bodyParser = require('body-parser');
//middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json())

//===============================
//Mostrar todas las categorias
//===============================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categoriasDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    error: err
                });
            }
            //Si todo bien hasta aqui, obtenemos el total.
            Categoria.count((err, total) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        error: err
                    });
                }

                return res.json({
                    ok: true,
                    total,
                    categorias: categoriasDB
                });
            });

        });
});

//===============================
//Mostrar un categoria especifica
//===============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    // console.log("ID", req.query.id);
    Categoria.findById(req.params.id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Categoria no encontrada'
                }
            });
        } else {
            return res.json({
                ok: true,
                categoria: categoriaDB
            });
        }
    });
});


//===============================
//Crear nueva categoria
//===============================
app.post('/categoria', verificaToken, (req, res) => {
    let cat = req.body;

    let categoria = new Categoria({
        nombre: cat.nombre,
        descripcion: cat.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        return res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//===============================
//Actualizar la categoria(solo el nombtre)
//===============================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    // let body = _.pick(req.body, ['nombre']);
    let categoriaUpdate = {
        nombre: req.body.nombre
    }
    Categoria.findByIdAndUpdate(id, categoriaUpdate, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            message: 'Categoria actualizada correctamente',
            categoria: categoriaDB
        })
    });
});

//===============================
//Actualizar la categoria(solo el nombtre)
//===============================
app.delete('/categoria/:id', [verificaToken, verificaAdminROLE], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndDelete(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});
module.exports = app;