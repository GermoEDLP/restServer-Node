const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar.jwt");

const login = async (req, res = response) => {
  const { correo, password } = req.body;
  try {
    // Verificar si el email existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Correo / Password incorrectas - correo",
      });
    }

    // Si el ususario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Correo / Password incorrectas - estado:false",
      });
    }

    // Verificar la contraseña
    const validPass = bcryptjs.compareSync(password, usuario.password);
    if (!validPass) {
        return res.status(400).json({
          msg: "Correo / Password incorrectas - pass ",
        });
      }

    // Generar el JWT
    const jwt = await generarJWT(usuario.id);

    res.json({
      usuario,
      jwt
    });
  } catch (error) {
    res.status(500).json({
      error,
      msg: "Contacte al administrador del servicio",
    });
  }
};

module.exports = {
  login,
};
