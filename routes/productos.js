const { Router, response } = require("express");
const { check } = require("express-validator");
const {
  validarJWT,
  validarCampos,
  isAdminRole,
  validarProductoId,
} = require("../middlewares");
const {
  crearProducto,
  getProductos,
  getProductoById,
  updateProducto,
  deleteProducto,
} = require("../controllers");
const router = Router();

router.get("/", getProductos);

router.get("/:id", [validarProductoId, validarCampos], getProductoById);

// Privado - autenticación con JWT valido
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es requerido").notEmpty(),
    check("categoria", "La categoria es necesaria").notEmpty(),
    check(
      "categoria",
      "La categoria debe ser un elemento de mongo"
    ).isMongoId(),
    validarCampos,
  ],
  crearProducto
);

// Privado - autenticación con JWT valido
router.put(
  "/:id",
  [
    check("id", "Se debe proveer un id").notEmpty(),
    check("id", "Debe ser un id valido").isMongoId(),
    validarCampos,
    validarJWT,
    validarProductoId,
    validarCampos,
  ],
  updateProducto
);

// Privado - solo admin
router.delete(
  "/:id",
  [
    check("id", "Debe ser un id valido").isMongoId(),
    validarCampos,
    validarJWT,
    isAdminRole,
    validarProductoId,
    validarCampos,
  ],
  deleteProducto
);

module.exports = router;
