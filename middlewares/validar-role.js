const { response } = require("express");
const usuario = require("../models/usuario");

const isAdminRole = (req, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: "No se puede validar el rol sin validar el token",
    });
  }

  const { rol, nombre } = req.usuario;

  if (rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `${nombre} no es Administrador. No puede realizar esta acción`,
    });
  }

  next();
};

const validarRoleLista = (...lista) => {
  return (req, res = response, next) => {
    if (!req.usuario) {
      return res.status(500).json({
        msg: "No se puede validar el rol sin validar el token",
      });
    }
    if (!lista.includes(req.usuario.rol)) {
      return res.status(401).json({
        msg: "El rol del usuario no permite esta acción",
        roles_con_acceso: lista,
      });
    }
    next();
  };
};

module.exports = {
  isAdminRole,
  validarRoleLista,
};
