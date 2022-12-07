const {Router} = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const {validarCampos} = require('../middlewares/validar-campos');
const {check} = require('express-validator');
const {isDate} = require('../helpers/isDate');
const { getAllVideos, subirVideo, actualizarVideo, eliminarVideo, getLastVideos, getVideosClave, getVideosUsuario, crearComentario, getComentarios, eliminarComentario, sumarVisualizacion, sumarLike, sumarDislike } = require('../controllers/videos');

const router = Router();

//Todas las peticiones tienen que pasar por la validacion del JWT
router.use(validarJWT);

//Obtener todos los videos
router.get('/', getAllVideos);

//Subir un nuevo video
router.post(
    '/', 
    [
        check('titulo', 'El titulo es obligatorio').not().isEmpty(),
        check('palabrasClave', 'Las palabras clave son obligatorias').not().isEmpty(),
        check('refVideo', 'La referencia al video es obligatorias').not().isEmpty(),
        validarCampos
    ], 
    subirVideo);

//Cambiar datos video
router.put(
    '/:id',
    [
        check('titulo', 'El titulo es obligatorio').not().isEmpty(),
        check('palabrasClave', 'Las palabras clave son obligatorias').not().isEmpty(),
        validarCampos
    ],  
    actualizarVideo);

//Eliminar video
router.delete('/:id', eliminarVideo);

//Obtener 8 ultimos videos
router.get('/last', getLastVideos);

//Obtener videos por palabra clave
router.get(
    '/clave', 
    [
        check('palabraClave', 'Las palabras clave son obligatorias').not().isEmpty(),
        validarCampos
    ],  
    getVideosClave);

//Visualización del video
router.put('/visualizacion/:id', sumarVisualizacion);

//Likes del video
router.put('/like/:id', sumarLike);

//Dislikes del video
router.put('/dislike/:id', sumarDislike);

//Obtener videos de un usuario
router.get('/user', getVideosUsuario);

//Obtener comentarios del video
router.get('/comentarios/:id', getComentarios);

//Crear un nuevo comentario
router.post(
    '/comentarios/:id',
    [
        check('comentario', 'El comentario es obligatorio').not().isEmpty(),
        validarCampos
    ],   
    crearComentario);

//Eliminar un comentario
router.delete('/comentarios/:id', eliminarComentario);

module.exports = router;