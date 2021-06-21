const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

// helpers con algunas funciones
const helpers = require('./helpers');

// Crear la conexión a la BD
const db = require('./config/db');

// Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado al Servidor , Puerto 3000'))
    .catch(error => console.log(error));

// crear una app de express
const app = express();

// Donde cargar los archivos estaticos
app.use(express.static('public'));

// Habilitamos Pug
app.set('view engine', 'pug');

//bodyParser para leer datos del formulario

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Agregamos express validator a toda la aplicación
app.use(expressValidator());



// Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));



app.use(cookieParser());

// sesiones para navegar entre distintas paginas sin volvernos a autenticar
app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());

// agregar flash mensajes
app.use(flash());

// Pasar variables a la aplicación
app.use((req, res, next) => {
    res.locals.year = 2021;
    // res.locals.stringObject = helpers.stringObject;
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = { ...req.user } || null;
    next();
});

app.use('/', routes());

const host = process.env.host || '0.0.0.0'; //Servidor

const PORT = process.env.PORT || 3306;//Puerto


app.listen(PORT, () => {
    console.log(`El servidor esta funcionando en el puerto ${PORT}`)
});