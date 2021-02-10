const express = require('express');
const { rest } = require('underscore');

const { verificaToken } = require('../middlewares/autenticacion');

let app = express();

let Producto = require('../modelos/producto');

//==============================
// Obtener productos
//==============================
app.get('/productos', verificaToken, (req, res) => {
    let desde = req.query.inicio || 0;
    let hasta = req.query.paginado || 5;
    Producto.find({})
        .populate('categoria', 'nombre descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde) //Inicio de consulta
        .limit(hasta) //paginado
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            }
            Producto.count({}, (err, total) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        error: err
                    });
                }

                return res.json({
                    ok: true,
                    total,
                    productos
                });
            });

        });
});

//==============================
// Obtener producto por ID
//==============================
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Debe ingresar un Id.'
            }
        });
    }
    Producto.findById(id, (err, producto) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error: err
                });
            }

            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'El producto solicitado no se encuentra en la BD.'
                    }
                });
            }

            return res.json({
                ok: true,
                producto
            });
        })
        .populate('categoria', 'nombre descripcion')
        .populate('usuario', 'nombre email');
});

//==============================
// Crear producto
//==============================
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'El producto no pudo crearse.'
                }
            });
        }

        return res.json({
            ok: true,
            producto,
            mensaje: 'Producto creado exitosamente'
        });
    })
});

//==============================
// Actualizar producto
//==============================
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Debe ingresar un Id.'
            }
        });
    }

    let producto = {
        nombre: req.body.nombre
    }
    Producto.findByIdAndUpdate(id, producto, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'El producto no pudo actualizarse.'
                }
            });
        }

        return res.json({
            ok: true,
            producto,
            mensaje: 'Producto actualizado exitosamente'
        });
    });
});

//==============================
// Actualizar producto
//==============================
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    if (!id) {
        return res.status(400).json({
            ok: false,
            error: {
                message: 'Debe ingresar un Id.'
            }
        });
    }
    let producto = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, producto, (err, producto) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            });
        }

        if (!producto) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'El producto no pudo eliminarse.'
                }
            });
        }

        return res.json({
            ok: true,
            producto,
            mensaje: 'Producto eliminado exitosamente'
        });
    });
});

module.exports = app;