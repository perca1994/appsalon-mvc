let paso = 1;
const pasoInicial = 1;
const pasoFinal = 3;

const cita = {
    id: '',
     nombre: '',
     fecha: '',
     hora: '',
     servicios:[]
}




document.addEventListener('DOMContentLoaded', function(){
    
iniciarApp();

})




function iniciarApp(){
  mostrarSeccion(); //muestra y oculta las secciones;
  tabs(); //cambia la seccion cuando se presionan los tabs
  botonesPaginador(); //Agrega o quita los botones del paginador
  paginaAnterior();
  paginaSiguiente();

  //mostrar servicios atraves de una API
  consultarAPI(); //consulta la API
  
  //completar formulario
  
  idCliente();
  nombreCliente(); //añade el nombre del cliente al objeto de cita
  seleccionarFecha(); //añade la fecha de la cita al objeto cita
  seleccionarHora();//Añade la hora de la cita en el objeto

  //Resumen cita
  mostrarResumen()//Muestra el resumen de la cita
  

}

function mostrarSeccion(){
    //ocultar la seccion que tenga la clase mostrar
    const seccionAnterior = document.querySelector('.mostrar');
    if(seccionAnterior){
        seccionAnterior.classList.remove('mostrar');

        
        //Quita la clase actual al tab anterior
        const tabAnterior = document.querySelector('.actual');
        if(tabAnterior){
            tabAnterior.classList.remove('actual');
        }
        //resalta el tab actual
        const tab = document.querySelector(`[data-paso ="${paso}"]`);
        tab.classList.add('actual');
    }
    
//Seleccionar la seccion con el paso..
const pasoSelector = `#paso-${paso}`
const seccion =document.querySelector(pasoSelector);
seccion.classList.add('mostrar');


}

function tabs(){
    const botones = document.querySelectorAll('.tabs button');
    botones.forEach( boton =>{ 
        boton.addEventListener('click', function(e){
            paso = parseInt(e.target.dataset.paso); 
            
            
            mostrarSeccion();
            botonesPaginador();


          
        });
    })
}




function botonesPaginador(){
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(paso === 1){
        paginaAnterior.classList.add('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    } else if(paso ===3){
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.add('ocultar');
        mostrarResumen();
    }else{
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');
    }

    mostrarSeccion();

}


function paginaAnterior(){
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click',function(){
        if(paso <= pasoInicial) return;
        paso--;

        botonesPaginador();
    })
}


function paginaSiguiente(){
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click',function(){
        if(paso >= pasoFinal) return;
        paso++;

        botonesPaginador();
    })
}

async function consultarAPI(){

     try {
        const url = `/api/servicios`;
        const resultado = await fetch(url);
        const servicios = await resultado.json();
            
        mostrarServicios(servicios);
       
     } catch (error) {
        console.log(error);
     }
}

function mostrarServicios(servicios){
    servicios.forEach((servicio)=>{
        const {id,nombre,precio} = servicio;
        
        const nombreServicio = document.createElement('P');
        nombreServicio.classList.add('nombre-servicio');
        nombreServicio.textContent = nombre;

        const precioServicio = document.createElement('P');
        precioServicio.classList.add('precio-servicio');
        precioServicio.textContent = `$${precio}`;

        const servicioDiv = document.createElement('DIV');
        servicioDiv.classList.add('servicio');
        servicioDiv.dataset.idServicio = id;
        servicioDiv.onclick = function(){
            seleccionarServicio(servicio);
        }

        servicioDiv.appendChild(nombreServicio);
        servicioDiv.appendChild(precioServicio);

        document.querySelector('#servicios').appendChild(servicioDiv);

    })
}


function seleccionarServicio(servicio){
    const {id} = servicio;
     const {servicios} = cita;

     const divServicio = document.querySelector(`[data-id-servicio ="${id}"]`);

     if(servicios.some(agregado=>agregado.id === id)){
         //Eliminarlo
        cita.servicios = servicios.filter( agregado=> agregado.id !== id);
        divServicio.classList.remove('seleccionado');
     } else{
        //agregarlo
        cita.servicios = [...servicios,servicio];
        divServicio.classList.add('seleccionado');
     }
}

function idCliente(){
    cita.id = document.querySelector('#id').value;
  
}

function nombreCliente(){
    cita.nombre = document.querySelector('#nombre').value;
  
}

function seleccionarFecha(){
    const inputFecha = document.querySelector('#fecha');
    inputFecha.addEventListener('input',(e)=>{

       const dia = new Date(e.target.value).getUTCDay();

       if([6,0].includes(dia)){
        e.target.value = '';
        mostrarAlerta('fines de semana no permitidos','error', '.formulario');
        
       }else{
        cita.fecha = e.target.value;
       }
    })
}

function mostrarAlerta(mensaje,tipo,elemento,desaparece = true){

   const alertaPrevia = document.querySelector('.alerta');
   if(alertaPrevia){
    alertaPrevia.remove(); 
   }; //previene que se cree otra alerta;

   //scriptin alerta
    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');
    alerta.classList.add(tipo);

    const referencia = document.querySelector(elemento).appendChild(alerta);
if(desaparece){
    setTimeout(()=>{alerta.remove();},3000)
}
}

function seleccionarHora(){

    inputHora = document.querySelector('#hora');

    inputHora.addEventListener('input',e=>{
        const hora = new Date(e.target.value).getUTCHours();
        if(hora < 9 || hora > 18){
            e.target.value = '';
            mostrarAlerta('horarios fuera de rango','error','.formulario');
            }else{
                cita.hora = e.target.value;
                }
                
    })
 
   


   
   };





function mostrarResumen(){
    const resumen = document.querySelector('.contenido-resumen');


    //limpiar contenido resumen
    while(resumen.firstChild){
        resumen.removeChild(resumen.firstChild);
    }    

    if(Object.values(cita).includes('') || cita.servicios.length === 0){
        mostrarAlerta('Faltan datos de Servicios, Fecha u Hora','error','.contenido-resumen',false);

        return;
    }
    
    //Formatear div de resumen
    const {nombre, fecha,hora, servicios} = cita;
 
    //heading para servicios en resumen
    const headingServicios =  document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios: ';
    resumen.appendChild(headingServicios);
//Iterando y mostrando los servicios
    servicios.forEach(servicio =>{
        const {id, precio, nombre} = servicio;

        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent= nombre;
        textoServicio.classList.add('texto-servicio');


        const precioServicio = document.createElement('P');
        precioServicio.innerHTML = `<span> Precio:</span> $${precio}`;

        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);
        resumen.appendChild(contenedorServicio);

    })
    
    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita: ';
    resumen.appendChild(headingCita);

    const nombreCliente = document.createElement('P');
    nombreCliente.innerHTML = `<span> Nombre: </span> ${nombre}`;
  //Formatear la fecha en español
  const fechaObj = new Date(fecha + ' 00:00');
  const opciones = {weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}
  const fechaFormateada = fechaObj.toLocaleDateString('es-AR', opciones); 


    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span> Fecha:  </span> ${fechaFormateada}`;

    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span> Hora: </span> ${hora} Horas`;

    //boton para crear una cita
    const botonReservar = document.createElement('BUTTON');
    botonReservar.textContent = 'Reservar Cita';
    botonReservar.classList.add('boton');
    botonReservar.onclick = reservarCita;
    

    resumen.appendChild(nombreCliente);
    resumen.appendChild(fechaCita);
    resumen.appendChild(horaCita);

    resumen.appendChild(botonReservar);
}

async function reservarCita(){

    const {nombre,fecha,hora,servicios,id} = cita;

    const idServicio = servicios.map(servicio => servicio.id);
  



  const datos = new FormData();

 
 datos.append('fecha',fecha);
 datos.append('hora',hora );
 datos.append('usuarioId',id);
 datos.append('servicios',idServicio);
  

try {
      //peticion hacia la api
  const url = '/api/citas';

  const respuesta = await fetch(url, {
    method: 'POST',
    body: datos
  })
  const resultado = await respuesta.json();

  if(resultado.resultado){
    Swal.fire({
        icon: "success",
        title: "Cita Creada",
        text: "Tu cita fue creada Correctamente",
        button:"OK"
          
      }).then(()=>{
        Swal.clickConfirm(window.location.reload());
      })
  }
} catch (error) {
    Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al guardar la cita!",
               
      })

      console.log(error);

      

}

console.log([...datos]);
}



  