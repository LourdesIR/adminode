const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

exports.proyectosHome = async (req, res) => {
    // Buscamos los proyectos del usuario (Todos son los que mostramos al costado)
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise =  Proyectos.findAll({where: { usuarioId  }});

    // Buscamos las tareas del usuario Sin culminar y culminadas para el tablero
    const tareasNoFinalizadasPromise = Tareas.findAll({ where: {estado:0}});
    const tareasFinalizadasPromise = Tareas.findAll({ where: {estado:1}});

    const [tareasFinalizadas,tareasNoFinalizadas, proyectos] = await Promise.all([tareasFinalizadasPromise, tareasNoFinalizadasPromise, proyectosPromise])

    //Contamos la cantidad de taras finalizadas y no finalizadas
    const tareasCulminadas = tareasFinalizadas.length;
    const tareasIniciadas = tareasNoFinalizadas.length;

    //Pasamos lo que vamos a mostrar a la vista
    res.render('index', {
        nombrePagina : 'Proyectos',
        proyectos,
        tareasCulminadas,
        tareasIniciadas
    });
}

exports.formularioProyecto = async (req, res) => {
    //Buscamo los proyectos del usuario
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId  }});

    //pasamos el formulario
    res.render('nuevoProyecto', {
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    })
}

exports.nuevoProyecto = async (req, res) => {

    //Pasamos el input para que el usuario cree un proyecto
    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId  }});


    // escuchamos y recibimos lo del input
    const nombre = req.body.nombre;

    let errores = [];

    
    // Si no hay nada
    if(!nombre) {
        errores.push({'texto': 'Agrega un Nombre al Proyecto'})
    }

    // manejo de errores
    if(errores.length > 0 ){
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
       
        // Guardamos los datos
        const usuarioId = res.locals.usuario.id;
        await Proyectos.create({ nombre, usuarioId });
        res.redirect('/');
    }
}

exports.proyectoPorUrl = async (req, res, next) => {
    const usuarioId = res.locals.usuario.id;
    // Buscamos los proyectos del usuario 
    const proyectosPromise = Proyectos.findAll({where: { usuarioId  }});

    // Buscamos la url del proyecto especifico que el usuario quiere mirar
    const proyectoPromise =  Proyectos.findOne({
        where: {
            url: req.params.url, 
            usuarioId
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise ]);

    
    // Buscamos las tareas asociadas a ese proyecto
    const tareas = await Tareas.findAll({
        where: {
            proyectoId : proyecto.id
        }
    });

    if(!proyecto) return next();
    // pasamos a la vista
    res.render('tareas', {
        nombrePagina : 'Tareas del Proyecto',
        proyecto,
        proyectos, 
        tareas
    })
}

exports.formularioEditar = async (req, res) => {

    //Buscamos los proyectos del usuario
    const usuarioId = res.locals.usuario.id;
    const proyectosPromise = Proyectos.findAll({where: { usuarioId  }});

    //Seleccionamos el indicado por id
    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id, 
            usuarioId
        }
    });
    const [proyectos, proyecto] = await Promise.all([proyectosPromise, proyectoPromise ]);

    // render a la vista
    res.render('nuevoProyecto', {
        nombrePagina : 'Editar Proyecto',
        proyectos,
        proyecto
    })
}



exports.actualizarProyecto = async (req, res) => {

    const usuarioId = res.locals.usuario.id;
    const proyectos = await Proyectos.findAll({where: { usuarioId  }});

    // validar que tengamos algo en el input
    const nombre = req.body.nombre;

    let errores = [];

    if(!nombre) {
        errores.push({'texto': 'Agrega un Nombre al Proyecto'})
    }

    // si hay errores
    if(errores.length > 0 ){
        res.render('nuevoProyecto', {
            nombrePagina : 'Nuevo Proyecto',
            errores,
            proyectos
        })
    } else {
        // No hay errores
        // Insertar en la BD.
        await Proyectos.update(
            { nombre: nombre },
            { where: { id: req.params.id }} 
        );
        res.redirect('/');
    }
}

exports.eliminarProyecto = async (req, res, next) => {
    // req, query o params
    // console.log(req.query);
    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({where: { url : urlProyecto}});

    if(!resultado){
        return next();
    }

    res.status(200).send('Proyecto Eliminado Correctamente');
}