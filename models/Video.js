const {Schema, model} = require('mongoose');

const VideoSchema = Schema({
    titulo: {
        type: String,
        required: true
    },
    likes: {
        type: Number
    },
    dislikes: {
        type: Number
    },
    palabrasClave: {
        type: Array,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    refVideo: {
        type: String,
        required: true
    },
    fecha: {
        type: Date
    },
    visualizaciones: {
        type: Number
    }
})

VideoSchema.method('toJSON', function() {
    const {__v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
})

module.exports = model('Video', VideoSchema)