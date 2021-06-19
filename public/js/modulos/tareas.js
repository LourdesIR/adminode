import axios from "axios";
import Swal from 'sweetalert2';

import {actualizarAvance} from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if(tareas) {
//Cuando aprieta el boton
    tareas.addEventListener('click', e => {
        if(e.target.classList.contains('fa-check-circle')){
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            //identifica la ubicacion
            const url = `${location.origin}/tareas/${idTarea}`;
            
            //modifica el estado
            axios.patch(url, { idTarea })
                .then(function(respuesta){
                    if(respuesta.status === 200){
                        icono.classList.toggle('completo');

                        actualizarAvance();
                    }
                })
        }

        if(e.target.classList.contains('fa-trash')) {
        
            //escuchamos el valor
            const tareaHTML = e.target.parentElement.parentElement, 
             //modificamos en el Dom
                  idTarea = tareaHTML.dataset.tarea;

                  //Mensaje de alerta antes de borrar
                  Swal.fire({
                    title: '¿Deseas borrar esta Tarea?',
                    text: "Una tarea eliminada no se puede recuperar",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, Borrar', 
                    cancelButtonText: 'No, Cancelar'
                }).then((result) => {
                    if (result.value) {
                        const url = `${location.origin}/tareas/${idTarea}`;

                        // Utilizo axios para conectarme a la db
                        axios.delete(url, { params: { idTarea }})
                            .then(function(respuesta) {
                                if(respuesta.status === 200) {

                                    // elimino el hijo del objeto evalueado
                                    tareaHTML.parentElement.removeChild(tareaHTML);

                                    // mensaje de alerta
                                    Swal.fire(
                                        'La Tarea fue Eliminada',
                                        respuesta.data,
                                        'success'
                                    )

                                    actualizarAvance();
                                }
                            });
                    }
                })
        }
    });

}

export default tareas;