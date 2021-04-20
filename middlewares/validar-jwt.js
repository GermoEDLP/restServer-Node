const { response, request } = require("express");
const jwt = require("jsonwebtoken");
const usuario = require("../models/usuario");
const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
  const token = req.header("x-token");

  if (!token) {
    return res.status(401).json({
      msg: "No se recibio un token",
    });
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETKEYJWT);

    // Validar Usuario
    const usuario = await Usuario.findById( uid );

    if (!usuario) {
      return res.status(401).json({
        msg: "Token invalido - No existe el ususario en la DB",
      });
    }
    if (!usuario.estado) {
      return res.status(401).json({
        msg: "Token invalido - EL ususario ya se enuentra deshabilitado",
      });
    }
    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(402).json({
      msg: "Token invalido",
    });
  }
};

module.exports = {
  validarJWT,
};
