const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');

exports.formCrearCuenta = (req, res ) => {
    res.render('crearCuenta', {
        nombrePagina : 'Crear Cuenta en Administrador Node'
    })
}


exports.formIniciarSesion = (req, res) => {
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina : 'Iniciar Sesión en Administrador Node', 
        error
    })
}

exports.crearCuenta = async (req, res) => {
    const { email, password } = req.body;

    try{
        await Usuarios.create({ email, password })

        const confirmUrl = `http://${request.headers.host}/confirmar-cuenta/${email}`;
        const user = { email };
        await enviarEmail.send({
            user, 
            subject: 'Confirmación de nueva cuenta en Admin Node', 
            confirmUrl, 
            file: 'account-confirm'
        });

        req.flash('correcto', 'Se ha enviado un correo electrónico de confirmación.');
        res.redirect('/iniciarSesion');
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            nombrePagina: 'Crear cuenta en Uptask',
            mensajes: req.flash(),
            email, 
            password,
        });
    }
}

exports.formRestablecerPassword = (req, res) => {
    res.render('reestablecer', {
        nombrePagina: 'Reestablecer tu Contraseña'
    })
}

// Cambia el estado de una cuenta
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    // si no existe el usuario
    if(!usuario) {
        req.flash('error', 'No valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();

    req.flash('correcto', 'Cuenta activada correctamente');
    res.redirect('/iniciar-sesion');

}