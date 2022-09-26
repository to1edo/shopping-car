const carrito = document.querySelector('#carrito');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarrito = document.querySelector('#vaciar-carrito');
const listaCursos = document.querySelector('#lista-cursos');
let borrarCurso = [];
let articulosCarrito = [];
let  contador;

cargarEventListeners();

function cargarEventListeners(){

    document.addEventListener('DOMContentLoaded',()=>{
        articulosCarrito = JSON.parse(localStorage.getItem('articulosCarrito')) || [];  //si no hay datos asignar un array vacio
        carritoHtml(articulosCarrito);
        actualizarContador();
    });

    //agragar el curso cuando se de click al boton "Agregar al Carrito"
    listaCursos.addEventListener('click', agregarCurso);
    vaciarCarrito.addEventListener('click', borrarCarrito);
}

function agregarCurso(e){
    e.preventDefault();

    if(e.target.classList.contains('agregar-carrito')){
        const cursoSeleccionado = e.target.parentElement.parentElement;
        leerDatosCurso(cursoSeleccionado);
    }
}

function leerDatosCurso(curso){
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        nombre: curso.querySelector('h4').textContent,
        precio: curso.querySelector('span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    }

    let estaAgredado = articulosCarrito.some(articulo => articulo.id === infoCurso.id);

    if(estaAgredado){
        articulosCarrito.forEach( articulo => {
            if(articulo.id === infoCurso.id){
                articulo.cantidad++;
            };
        });
    }else{
        articulosCarrito = [...articulosCarrito,infoCurso];
    }

    sincronizarStorage();
    carritoHtml(articulosCarrito);
    actualizarContador();
}

function carritoHtml(articulos){
    limpiarHtml();

    articulos.forEach(articulo => {
        const elemento = document.createElement('tr');

        elemento.innerHTML = `
                                <td><img src="${articulo.imagen}" class="imagen-curso u-full-width"></td>
                                <td style="font-size:12px">${articulo.nombre}</td>
                                <td>${articulo.precio}</td>
                                <td>${articulo.cantidad}</td>
                                <td>
                                    <a href="#" class="borrar-curso" data-id="${articulo.id}">X</a>
                                </td>
                            `;
        
        contenedorCarrito.appendChild(elemento);
        
        borrarCurso = document.querySelectorAll('#lista-carrito .borrar-curso');
        borrarCurso.forEach( curso => curso.addEventListener('click', eliminarCurso));
    });
}

function limpiarHtml(){
    while(contenedorCarrito.firstChild){
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

function eliminarCurso(e){
    e.preventDefault();
    const seleccionado = e.target.getAttribute('data-id')

    let cursos = [];
    articulosCarrito.forEach( articulo => {

        if(articulo.id !== seleccionado){
            cursos = [...cursos, articulo]; 
        }else if(articulo.cantidad > 1){
                    articulo.cantidad--;
                    cursos = [...cursos, articulo]; 
                }
    });

    articulosCarrito = [...cursos];
    carritoHtml(articulosCarrito);
    actualizarContador();
    sincronizarStorage();
}

function borrarCarrito(e){
    e.preventDefault();
    limpiarHtml();
    articulosCarrito = [];
    actualizarContador();
}

function actualizarContador(){
    const contadorCarrito = document.querySelector('.contador-carrito');
    contador = articulosCarrito.length;
    contadorCarrito.textContent = contador;
}


function sincronizarStorage(){
    localStorage.setItem('articulosCarrito',JSON.stringify(articulosCarrito));
}