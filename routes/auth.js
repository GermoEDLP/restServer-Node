const { Router } = require('express');
const { check } = require('express-validator');
const { login } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();


router.post('/login',[
    check("correo", "EL correo debe ser valido").isEmail(),
    check("password", "La contraseña no es valida").notEmpty(),
    validarCampos
], login );


module.exports = router;