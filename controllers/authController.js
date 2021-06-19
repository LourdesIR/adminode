// AuthController.js
const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs/bCrypt');
const enviarEmail = require('../handlers/email');

// autenticar el usuario
exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/', 
    failureRedirect: '/iniciar-sesion',
    failureFlash : true,
    badRequestMessage: 'Debes completar todos los campos o \n Verifique su casilla de correo en caso de ser su primera vez'
});

// ¿El usuario existe?
exports.usuarioAutenticado = (req, res, next) => {

    // ¿El usuario esta autentificado?
    if(req.isAuthenticated()) {
        return next();
    }
    // sino esta lo esta, se redirigir al inicio de sesion
    return res.redirect('/iniciar-sesion');
}

// función para cerrar sesión y redirigir a inicio de sesion
exports.cerrarSesion = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/iniciar-sesion'); 
    })
}

//crear un token 
exports.enviarToken = async (req, res) => {
    // ¿el usuario existe?
    const {email} = req.body
    const usuario = await Usuarios.findOne({where: { email }});

    // Si no existe el usuario envia un mensaje
    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }

    // si el usuario existe creo el token
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    // lo guardo en la base de datos con save()
    await usuario.save();

    // genero una url
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    // Enviar el Correo con el Token
    await enviarEmail.enviar({
        usuario,
        subject: 'Restablecer contraseña', 
        resetUrl, 
        archivo : 'reestablecer-password'
    });

    // mando un mensaje y lo redirijo a inicio de sesion
    req.flash('correcto', 'Se envió un mensaje a tu correo');
    res.redirect('/iniciar-sesion');
}

exports.validarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });

    // sino encuentra el usuario
    if(!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    // Formulario para generar el password
    res.render('resetPassword', {
        nombrePagina : 'Reestablecer Contraseña'
    })
}

// cambia el password por uno nuevo
exports.actualizarPassword = async (req, res) => {

    // Verifica el token valido pero también la fecha de expiración
    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now()
            }
        }
    });

    // verificamos si el usuario existe
    if(!usuario) {
        req.flash('error', 'No Válido');
        res.redirect('/reestablecer');
    }

    // hashear el nuevo password

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10) );
    usuario.token = null;
    usuario.expiracion = null;
    
    // guardamos el nuevo password
    await usuario.save();

    req.flash('correcto', 'Tu contraseña se ha modificado correctamente');
    res.redirect('/iniciar-sesion');

}