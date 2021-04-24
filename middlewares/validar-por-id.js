const { response } = require("express");
const { Categoria, Productos } = require("../models");

const validarCategoriaId = async(req, res = response, next) => {

    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario');
    if (!categoria) {
        return res.status(404).json({
            msg: `La cetgoría no fue encontrada`,
        });
    }
    req.categoria = categoria;

    next();
};

const validarProductoId = async(req, res = response, next) => {

    const { id } = req.params;
    const producto = await Productos.findById(id).populate('usuario', 'nombre').populate('categoria', 'nombre');
    if (!producto) {
        return res.status(404).json({
            msg: `EL producto no fue encontrado`,
        });
    }
    req.producto = producto;

    next();
};

module.exports = {
    validarCategoriaId,
    validarProductoId
}