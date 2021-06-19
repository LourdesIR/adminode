import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar){
    btnEliminar.addEventListener('click', e => {
        const urlProyecto = e.target.dataset.proyectoUrl;

        //Explicado en tareas js
        Swal.fire({
            title: '¿Deseas borrar este proyecto?',
            text: "Un vez eliminado no se puede recuperar",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borrar', 
            cancelButtonText: 'No, Cancelar'
        }).then((result) => {
            if (result.value) {
                // Busca en la base de datos con axios
                const url = `${location.origin}/proyectos/${urlProyecto}`;

                axios.delete(url, { params: {urlProyecto}})
                    .then(function(respuesta){
                        console.log(respuesta);
                            //Manda mensaje de eliminado
                            Swal.fire(
                                'El proyecto ha sido Eliminado',
                                respuesta.data,
                                'success'
                            );

                            // nos regresa al inicio despues de 3 segundos
                            setTimeout(() => {
                                window.location.href = '/'
                            }, 3000);
                    })
                    .catch(() => {
                         //mensaje de error
                        Swal.fire({
                            type:'error',
                            title: 'Hubo un error',
                            text: 'No se pudo eliminar el Proyecto'
                        })
                    })
            }
        })
    })
}
export default btnEliminar;