const categorias = require("./categorias");
const usuarios = require("./usuarios");
const auth = require("./auth");

module.exports = {
  ...categorias,
  ...usuarios,
  ...auth,
};
