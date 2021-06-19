import Swal from 'sweetalert2';

export const actualizarAvance = () => {
    // buscamos las tareas existentes en el dom
    const tareas = document.querySelectorAll('li.tarea');

    if( tareas.length ) {
        // buscamos las tareas las tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo');

        // calculamos el porcentaje de avance
        const avance = Math.round((tareasCompletas.length / tareas.length) * 100);

        // mostramos en el dom con los porcentajes / modificando el width
        const porcentaje = document.querySelector('#porcentaje');
        porcentaje.style.width = avance+'%';

        if(avance === 100) {
            Swal.fire(
                'Completaste el Proyecto',
                'Genial.!! ya terminaste tus tareas',
                'success'
            )
        }
    }
}

export const tareasComenzadas = () => {
    // buscamos las tareas existentes en el dom
    const tareas = document.querySelectorAll('li.tarea');

    if( tareas.length ) {
        // buscamos las tareas las tareas completadas
        const tareasIniciadas = document.querySelectorAll('i.completo');

        // mostramos en el dom las tareas completas
        const tareasIni = document.querySelector('#tareaIni');
        tareasIni.innerHTML = tareasIniciadas;

    }
}

export const tareasTerminadas = () => {
    // buscamos las tareas existentes en el dom
    const tareas = document.querySelectorAll('li.tarea');

    if( tareas.length ) {
        // buscamos las tareas las tareas completadas
        const tareasCompletas = document.querySelectorAll('i.completo');

        // mostramos en el dom las tareas completas
        const tareasFin = document.querySelector('#tareaFin');
        tareasFin.innerHTML = tareasCompletas;

    }
}

