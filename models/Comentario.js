const {Schema, model} = require('mongoose');

const ComentarioSchema = Schema ({
    comentario: {
        type: String,
        required: true,
    },
    likes: {
        type: Number
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: 'Video',
        required: true
    }
})

ComentarioSchema.method('toJSON', function() {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
})

module.exports = model('Comentario', ComentarioSchema);