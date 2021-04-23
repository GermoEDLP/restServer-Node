const { response } = require("express");
const { Categoria } = require("../models");

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

module.exports = {
    validarCategoriaId
}