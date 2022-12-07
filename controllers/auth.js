const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const {generarJWT} = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

    const {email, contraseña} = req.body;

    try {

        let usuario = await Usuario.findOne({email});

        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario con ese correo'
            })
        }

        usuario = new Usuario(req.body);

        //Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.contraseña = bcrypt.hashSync(contraseña, salt);

        await usuario.save();

        //Generar token
        const token = await generarJWT(usuario.id, usuario.nombre);

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            nombre: usuario.nombre,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        });
    }
}

const loginUsuario = async(req, res = response) => {

    const { email, contraseña } = req.body;

    try {
        const usuario = await Usuario.findOne({email});

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'No existe un usuario con ese correo'
            })
        }

        //Confirmar la contraseña
        const validPassword = bcrypt.compareSync(contraseña, usuario.contraseña);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecta'
            })
        }

        //Generar nuestro token
        const token = await generarJWT(usuario.id, usuario.nombre);

        res.json({
            ok: true,
            uid: usuario.id,
            nombre: usuario.nombre,
            token
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        });
    }
}

const revalidarToken = async(req, res = response) => {
    const {uid, nombre} = req;

    const token = await generarJWT(uid, nombre);

    res.json({
        ok: true,
        uid,
        nombre,
        token
    })
}

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}