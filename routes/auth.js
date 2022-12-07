const { Router} = require('express');
const { check } = require('express-validator');
const router = Router();
const { crearUsuario, revalidarToken, loginUsuario } = require('../controllers/auth');
const {validarCampos} = require('../middlewares/validar-campos')
const {validarJWT} = require('../middlewares/validar-jwt');

router.post(
    '/new',
    [//Middlewares
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('contraseña', 'La contraseña debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    crearUsuario
);

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('contraseña', 'La contraseña debe de ser de 6 caracteres').isLength({ min: 6 }),
        validarCampos
    ],
    loginUsuario
);

router.get(
    '/renew',
    validarJWT,
    revalidarToken
);

module.exports = router;