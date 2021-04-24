const { response } = require("express");

const { Productos } = require("../models");

// Obtener categorias - paginado - total - populate

const getProductos = async (req, res = response) => {
  try {
    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, productos] = await Promise.all([
      Productos.countDocuments(query),
      Productos.find(query)
        .skip(Number(desde))
        .limit(Number(limite))
        .populate("usuario", "nombre")
        .populate("categoria", "nombre"),
    ]);

    res.status(200).json({
      total,
      productos,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error en la obtención.",
      error,
    });
  }
};

// Obtener categoria por id - populate
const getProductoById = async (req, res = response) => {
  try {
    const { producto } = req;

    res.json({
      producto
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error en la obtención.",
      error,
    });
  }
};

const crearProducto = async (req, res = response) => {
  try {
    const { nombre, categoria } = req.body;
    const productoDB = await Productos.findOne({ nombre });

    if (productoDB) {
      return res.status(400).json({
        msg: `Producto existente en BD: ${productoDB.nombre}`,
      });
    }

    const data = {
      nombre: nombre.toUpperCase(),
      categoria,
      usuario: req.usuario._id,
    };
    const producto = new Productos(data);
    await producto.save();
    res.status(201).json({
      msg: `Producto creado correctamente`,
      producto,
    });
  } catch (error) {
    res.status(500).json({
      msg: `Contacte con el administrador.`,
      error,
    });
  }
};

// Actualizar categoria por id
const updateProducto = async (req, res = response) => {
  try {
    const { nombre, categoria } = req.body;
    const { producto } = req;

    if (!producto.estado) {
      return res.status(406).json({
        msg: "El producto no se encuentra activo",
      });
    }

    if (nombre) {
      producto.nombre = nombre.toUpperCase();
      await Productos.findOneAndUpdate(producto);
    }
    if(categoria){
        producto.categoria = categoria;
        await Productos.findOneAndUpdate(producto);
    }

    res.json({
      producto,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error en la actualización.",
      error,
    });
  }
};

// Borrar categoria por id - estado:false
const deleteProducto = async (req, res = response) => {
  try {
    const { producto } = req;

    if (!producto.estado) {
      return res.status(406).json({
        msg: "El producto ya se encuentra inactivo",
      });
    }

    producto.estado = false;

    await Productos.findOneAndUpdate(producto);

    res.json({
      producto,
    });
  } catch (error) {
    res.status(500).json({
      msg: "Error en la eliminación.",
      error,
    });
  }
};

module.exports = {
  crearProducto,
    getProductos,
    getProductoById,
    updateProducto,
    deleteProducto,
};
