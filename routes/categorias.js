const { Router, response } = require("express");
const { check } = require("express-validator");
const {
  validarJWT,
  validarCampos,
  isAdminRole,
  validarCategoriaId,
} = require("../middlewares");
const { existeCategoriaPorId } = require("../helpers/db-validators");
const {
  crearCategoria,
  getCategorias,
  getCategoriaById,
  updateCategoria,
  deleteCategoria,
} = require("../controllers");
const router = Router();

router.get("/", getCategorias);

router.get(
  "/:id",
  [
    validarCategoriaId,
    validarCampos,
  ],
  getCategoriaById
);

// Privado - autenticación con JWT valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es requerido").notEmpty(),
    validarCampos,
  ],
  crearCategoria
);

// Privado - autenticación con JWT valido
router.put(
  "/:id",
  [
    validarJWT,
    validarCategoriaId,
    validarCampos,
  ],
  updateCategoria
);

// Privado - solo admin
router.delete(
  "/:id",
  [
    validarJWT,
    isAdminRole,
    validarCategoriaId,
    validarCampos,
  ],
  deleteCategoria
);

module.exports = router;
