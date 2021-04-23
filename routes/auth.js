const { Router } = require('express');
const { check } = require('express-validator');
const { login, googleSignIn } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const router = Router();


router.post('/login',[
    check("correo", "EL correo debe ser valido").isEmail(),
    check("password", "La contraseña no es valida").notEmpty(),
    validarCampos
], login );

router.post('/googleSignIn',[
    check("id_token", "El Token de Google es necesario").notEmpty(),
    validarCampos
], googleSignIn );


module.exports = router;