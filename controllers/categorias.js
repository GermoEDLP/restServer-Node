const { response } = require("express");

const { Categoria } = require("../models");

// Obtener categorias - paginado - total - populate
const getCategorias = async (req, res = response) => {
  try {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
      Categoria.countDocuments(query),
      Categoria.find(query).skip(Number(desde)).limit(Number(limite)).populate('usuario'),
    ]);

    res.status(200).json({
      total,
      categorias,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error en la obtención.",
      error,
    });
  }
};

// Obtener categoria por id - populate
const getCategoriaById = async (req, res = response) => {
  try {
    const { categoria } = req;

    res.json({
      categoria,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error en la obtención.",
      error,
    });
  }
};

const crearCategoria = async (req, res = response) => {
  const nombre = req.body.nombre.toUpperCase();

  try {
    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
      return res.status(400).json({
        msg: `Categoria existente en BD: ${categoriaDB.nombre}`,
      });
    }

    const data = {
      nombre,
      usuario: req.usuario._id,
    };
    const categoria = new Categoria(data);
    await categoria.save();
    res.status(201).json({
      msg: `Categoria ${categoria.nombre} creada correctamente`,
      categoria,
    });
  } catch (error) {
    res.status(500).json({
      msg: `Contacte con el administrador.`,
    });
  }
};

// Actualizar categoria por id
const updateCategoria = async (req, res = response) => {
  try {
    const { nombre } = req.body;
    const { categoria } = req;

    if (!categoria.estado) {
      return res.status(406).json({
        msg: "La categoría no se encuentra activa",
      });
    }

    if (nombre) {
      categoria.nombre = nombre.toUpperCase();
      await Categoria.findOneAndUpdate(categoria);
    }

    res.json({
      categoria,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error en la actualización.",
      error,
    });
  }
};

// Borrar categoria por id - estado:false
const deleteCategoria = async (req, res = response) => {
  try {
    const { categoria } = req;

    if (!categoria.estado) {
      return res.status(406).json({
        msg: "La categoría ya se encuentra inactiva",
      });
    }

    categoria.estado = false;

    await Categoria.findOneAndUpdate(categoria);

    res.json({
      categoria,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error en la eliminación.",
      error,
    });
  }
};

module.exports = {
  crearCategoria,
  getCategorias,
  getCategoriaById,
  updateCategoria,
  deleteCategoria,
};
