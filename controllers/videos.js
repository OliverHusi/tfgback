const { response } = require('express');
const Video = require('../models/Video');
const Comentario = require('../models/Comentario');

const getAllVideos = async (req, res = response) => {
    const videos = await Video.find();

    res.json({
        ok: true,
        videos
    })
};

const subirVideo = async (req, res = response) => {
    const video = new Video(req.body);

    try {
        video.usuario = req.uid;
        video.likes = 0;
        video.dislikes = 0;
        video.fecha = new Date(Date.now());
        video.visualizaciones = 0;
        const videoGuaradado = await video.save();
        res.json({
            ok: true,
            video: videoGuaradado
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        });
    }
}

const actualizarVideo = async (req, res = response) => {
    const videoId = req.params.id;
    const uid = req.uid;

    try {
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe video con ese id'
            })
        }

        if (video.usuario.toString() != uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes privilegios para editar este video'
            })
        }

        const nuevoVideo = {
            ...req.body,
            ususario: uid
        }

        const videoActualizado = await Video.findByIdAndUpdate(videoId, nuevoVideo, { new: true }); //Devolvemos el video actualizado

        res.json({
            ok: true,
            video: videoActualizado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        });
    }
}

const eliminarVideo = async (req, res = response) => {
    const videoId = req.params.id;
    const uid = req.uid;

    try {
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe video con ese id'
            })
        }

        if (video.usuario.toString() != uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes privilegios para eliminar este video'
            })
        }

        await Video.findByIdAndDelete(videoId);

        res.json({
            ok: true
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        });
    }
}

const getLastVideos = async (req, res = response) => {
    const videos = await Video.find();

    const lastVideos = [];

    for (i = 0; i < 8; i++) {
        const video = videos[(videos.length - 1) - i];
        if (video) {
            lastVideos.push(video);
        }
    }

    res.json({
        ok: true,
        lastVideos
    })
}

const getVideosClave = async (req, res = response) => {
    const videos = await Video.find();
    const palabraClave = req.body.palabraClave;

    const videosClave = [];

    videos.forEach(video => {
        const palabrasClave = video.palabrasClave;
        if (palabrasClave.includes(palabraClave)) {
            videosClave.push(video);
        }
    });

    res.json({
        ok: true,
        videosClave
    })
}

const getVideosUsuario = async (req, res = response) => {
    const uid = req.uid;
    const videos = await Video.find();

    const videosUsuario = [];

    videos.forEach(video => {
        if (video.usuario.toString() === uid) {
            videosUsuario.push(video);
        }
    });

    res.json({
        ok: true,
        videosUsuario
    })
}

const crearComentario = async (req, res = response) => {
    const videoId = req.params.id;
    const comentario = new Comentario(req.body);

    try {
        comentario.usuario = req.uid;
        comentario.video = videoId;
        const comentarioGuardado = await comentario.save();
        res.json({
            ok: true,
            comentario: comentarioGuardado
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        });
    }
}

const getComentarios = async (req, res = response) => {
    const videoId = req.params.id;
    const comentarios = await Comentario.find();

    const comentariosVideo = [];

    comentarios.forEach(comentario => {
        if (comentario.video.toString() === videoId) {
            comentariosVideo.push(comentario);
        }
    });

    res.json({
        ok: true,
        comentariosVideo
    })
}

const eliminarComentario = async (req, res = response) => {
    const comentarioId = req.params.id;
    const uid = req.uid;

    try {

        const comentario = await Comentario.findById(comentarioId);
        if (!comentario) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe comentario con ese id'
            })
        }
        const videoId = comentario.video.toString();
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe video con ese id'
            })
        }

        if (video.usuario.toString() != uid) {
            console.log(uid);
            console.log(video.usuario.toString());
            return res.status(401).json({
                ok: false,
                msg: 'No tienes privilegios para eliminar este comentario'
            })
        }

        await Comentario.findByIdAndDelete(comentarioId);

        res.json({
            ok: true
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        });
    }
}

const sumarVisualizacion = async(req, res = response) => {
    const videoId = req.params.id;

    try {
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe video con ese id'
            })
        }

        video.visualizaciones = video.visualizaciones + 1;

        const nuevoVideo = {
            ...video
        }

        const videoActualizado = await Video.findByIdAndUpdate(videoId, nuevoVideo, { new: true }); //Devolvemos el video actualizado

        res.json({
            ok: true,
            video: videoActualizado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        });
    }
}

const sumarLike = async(req, res = response) => {
    const videoId = req.params.id;

    try {
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe video con ese id'
            })
        }

        video.likes = video.likes + 1;

        const nuevoVideo = {
            ...video
        }

        const videoActualizado = await Video.findByIdAndUpdate(videoId, nuevoVideo, { new: true }); //Devolvemos el video actualizado

        res.json({
            ok: true,
            video: videoActualizado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        });
    }
}

const sumarDislike = async(req, res = response) => {
    const videoId = req.params.id;

    try {
        const video = await Video.findById(videoId);
        if (!video) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe video con ese id'
            })
        }

        video.dislikes = video.dislikes + 1;

        const nuevoVideo = {
            ...video
        }

        const videoActualizado = await Video.findByIdAndUpdate(videoId, nuevoVideo, { new: true }); //Devolvemos el video actualizado

        res.json({
            ok: true,
            video: videoActualizado
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el admin'
        });
    }
}

module.exports = {
    getAllVideos,
    subirVideo,
    actualizarVideo,
    eliminarVideo,
    getLastVideos,
    getVideosClave,
    getVideosUsuario,
    crearComentario,
    getComentarios,
    eliminarComentario,
    sumarVisualizacion,
    sumarLike,
    sumarDislike
}