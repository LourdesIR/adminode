import proyectos from './modulos/proyectos';
import tareas from './modulos/tareas';
import {actualizarAvance , tareasTerminadas , tareasComenzadas} from './funciones/avance';

document.addEventListener('DOMContentLoaded', () => {
    actualizarAvance();
    tareasTerminadas();
    tareasComenzadas();
})