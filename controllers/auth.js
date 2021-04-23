const { response } = require("express");
const { Usuario } = require("../models");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar.jwt");
const { googleVerify } = require("../helpers/google-validator");

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
      jwt,
    });
  } catch (error) {
    res.status(500).json({
      error,
      msg: "Contacte al administrador del servicio",
    });
  }
};

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { correo, img, nombre } = await googleVerify(id_token);

    // Verificar si el email existe
    const usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      // Creo un nuevo usuario
      const data = {
        nombre,
        img,
        correo,
        google: true,
        password: ":P",
      };
      usuario = new Usuario(data);
      await usuario.save();
    }

    if (!usuario.estado) {
      // Bloquear la entrada a un ususario borrado
      return res.status(401).json({
        msg: "Usuario bloqueado. Contacte con la el administrador",
      });
    }

    // Generar el JWT
    const jwt = await generarJWT(usuario.id);

    res.json({
      usuario,
      token: jwt,
    });
  } catch (error) {
    res.status(400).json({
      err: "Token no valido - jwt",
      error,
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
