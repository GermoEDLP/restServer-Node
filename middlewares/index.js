const validarCampos = require("../middlewares/validar-campos");
const validarJWT = require("../middlewares/validar-jwt");
const validarRol = require("../middlewares/validar-role");

module.exports = {
    ...validarRol,
    ...validarJWT,
    ...validarCampos
}
