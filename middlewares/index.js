const validarCampos = require("../middlewares/validar-campos");
const validarJWT = require("../middlewares/validar-jwt");
const validarRol = require("../middlewares/validar-role");
const validarCategoria = require("./validar-por-id");

module.exports = {
    ...validarRol,
    ...validarJWT,
    ...validarCampos,
    ...validarCategoria
}
