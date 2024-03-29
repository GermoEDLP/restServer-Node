const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    precio: {
        type: Number,
        default: 0
    },
    estado: {
        type: Boolean,
        default: true,
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
});


ProductoSchema.methods.toJSON = function() {
    const { __v, _id, estado, ...producto  } = this.toObject();
    return {...producto, uid:_id};
}

module.exports = model( 'Producto', ProductoSchema );
