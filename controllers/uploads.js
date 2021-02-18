const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require("express");
const { subirArchivo } = require("../helpers/subir-archivo");
const { Usuario, Producto } = require('../models');


const cargarArchivo = async(req, res = response) => {
    try {
        //const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
        const nombre = await subirArchivo(req.files, undefined, undefined);
        res.json({
            nombre
        })
    } catch (err) {
        res.status(400).json({ err });
    }

}

const actualizarImagen = async(req, res = response) => {
    const { id, coleccion } = req.params;
    let archivos = req.files;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `El usuario con el Id ${id} no existe` });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `El producto con el Id ${id} no existe` });
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            })
    }
    //console.log(req.files);
    try {
        //Limpiar imagenes previas
        // console.log(modelo.img);
        if (modelo.img) {
            //Hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            //console.log(pathImagen);
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen);
                //console.log("Archivo borrado");
            }
        }

        const nombre = await subirArchivo(archivos, undefined, coleccion);
        modelo.img = nombre;
        await modelo.save();

        res.json({ modelo })
    } catch (err) {
        res.status(400).json({ err });
    }
}

const mostrarImagen = async(req, res = response) => {
    const { id, coleccion } = req.params;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `El usuario con el Id ${id} no existe` });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `El producto con el Id ${id} no existe` });
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            })
    }
    try {
        //Limpiar imagenes previas
        // console.log(modelo.img);
        if (modelo.img) {
            //Hay que borrar la imagen del servidor
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);
            //console.log(pathImagen);
            if (fs.existsSync(pathImagen)) {
                return res.sendFile(pathImagen);
            }
        }

    } catch (err) {
        res.status(400).json({ err });
    }
    const pathImagenRelleno = path.join(__dirname, '../assets', 'no-image.jpg');
    return res.sendFile(pathImagenRelleno);
}


const actualizarImagenCloudinary = async(req, res = response) => {
    const { id, coleccion } = req.params;
    let archivos = req.files;
    let modelo;

    switch (coleccion) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `El usuario con el Id ${id} no existe` });
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if (!modelo) {
                return res.status(400).json({ msg: `El producto con el Id ${id} no existe` });
            }
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvido validar esto'
            })
    }
    //console.log(req.files);
    try {
        //Limpiar imagenes previas
        // console.log(modelo.img);
        if (modelo.img) {
            const nombreArr = modelo.img.split('/');
            const nombre = nombreArr[nombreArr.length - 1];
            const [public_id] = nombre.split('.')
            cloudinary.uploader.destroy(public_id);
        }
        const { tempFilePath } = archivos.archivo;
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath);
        modelo.img = secure_url;
        await modelo.save();

        res.json({ modelo })
    } catch (err) {
        res.status(400).json({ err });
    }
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,
    actualizarImagenCloudinary
}