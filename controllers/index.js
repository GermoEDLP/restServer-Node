const categorias = require("./categorias");
const usuarios = require("./usuarios");
const auth = require("./auth");
const productos = require("./productos");
const buscar = require("./buscar");

module.exports = {
  ...categorias,
  ...usuarios,
  ...auth,
  ...productos,
  ...buscar
};
