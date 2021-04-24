const { response } = require("express");
const { Usuario, Categoria, Productos } = require("../models");
const { ObjectId } = require("mongoose").Types;

const coleccionesPermitidas = ["usuarios", "categorias", "productos", "roles"];

const buscarUsuarios = async (termino = "", res) => {
  const esMongoID = ObjectId.isValid(termino);
  console.log(esMongoID);
  if (esMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      result: usuario ? [usuario] : [],
    });
  }

  //Expresión regular que vuelve insensible a mayuscula la busqueda
  const regex = new RegExp(termino, "i");
  const usuarios = await Usuario.find({
    $or: [{ nombre: regex }, { correo: regex }],
    $and: [{ estado: true }],
  });

  res.json({
    results: usuarios,
  });
};

const buscarCategorias = async (termino = "", res) => {
  const esMongoID = ObjectId.isValid(termino);
  if (esMongoID) {
    const categoria = await Categoria.findById(termino);
    return res.json({
      result: categoria ? [categoria] : [],
    });
  }
  const regex = new RegExp(termino, "i");
  const categorias = await Categoria.find({ nombre: regex, estado: true });

  res.json({
    results: categorias,
  });
};
const buscarProductos = async (termino = "", res) => {
  const esMongoID = ObjectId.isValid(termino);
  if (esMongoID) {
    const producto = await Productos.findById(termino);
    return res.json({
      result: producto ? [producto] : [],
    });
  }
  const regex = new RegExp(termino, "i");
  const productos = await Productos.find({ nombre: regex, estado: true });

  res.json({
    results: productos,
  });
};

const buscar = async (req, res = response) => {
  const { coleccion, termino } = req.params;

  if (!coleccionesPermitidas.includes(coleccion)) {
    return res.status(400).json({
      msg: "Colocar una colección permitida.",
    });
  }

  switch (coleccion) {
    case "usuarios":
      await buscarUsuarios(termino, res);
      break;
    case "categorias":
      await buscarCategorias(termino, res);
      break;
    case "productos":
      await buscarProductos(termino, res);
      break;

    default:
      res.status(500).json({
        msg: "Constacte al administrador",
      });
      break;
  }
};

module.exports = {
  buscar,
};
