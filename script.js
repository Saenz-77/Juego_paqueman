const sectionAtaque = document.getElementById('ataque');
const personaje = document.getElementById('boton_seleccion');
const contPersonajes = document.getElementById('contenedor-personajes');
const reinicio = document.getElementById('reiniciar');

const sectionPersonaje = document.getElementById('seleccion_personaje');
const jugador = document.getElementById('personaje_select');

const enemigoSelect = document.getElementById('enemigo_select');

const contenedorAtaques = document.getElementById('contenedor-ataques');

const vistaVidaJugador = document.getElementById('vida-j');
const vistaVidaEnemigo = document.getElementById('vida-e');

const mensaje = document.getElementById('resultado')
const atackPersonaje = document.getElementById('ataques-personaje')
const atackEnemigo = document.getElementById('ataques-enemigo')

const sectionVerMapa = document.getElementById('ver_mapa');
const mapa = document.getElementById('mapa');

let i = 0;
let paquemanes = []
let ataquesPersonaje;
let ataqueJugador = [];
let ataqueEnemigo = [];
let vidaJugador = 4;
let vidaEnemigo = 4;
let opcionPaquemanes;
let tombo;
let ñero;
let civil;
let roljugador;
let rolSeleccionado;
let arma;
let navaja;
let puño;
let botones = [];
let ataquesDelEnemigo = [];
let indexAtaqueJugador;
let indexAtaqueEnemigo;
let victoriasJugador = 0;
let victoriasEnemigo = 0;
let lienzo = mapa.getContext("2d")
let intervalo;
let mapaBackground = new Image()
mapaBackground.src = './img/mapa.png'


class Paqueman {
  constructor(nombre, img, vida){
    this.nombre = nombre
    this.img = img
    this.vida = vida
    this.ataques = []
    this.x = 20
    this.y = 30
    this.ancho = 80
    this.alto = 80
    this.mapaImg = new Image()
    this.mapaImg.src = img
    this.velocidadX = 0
    this.velocidadY = 0
  }
}

let Tombo = new Paqueman('Tombo', './img/tombo.png', 4);
let Ñero = new Paqueman('Ñero', './img/ñero.png', 3);
let Civil = new Paqueman('Civil', './img/civil.png', 2);

Tombo.ataques.push(
  { nombre: '🔫', id: 'ataque_arma' },
  { nombre: '🔫', id: 'ataque_arma' },
  { nombre: '🔫', id: 'ataque_arma' },
  { nombre: '🗡️', id: 'ataque_navaja' },
  { nombre: '👊🏼', id: 'ataque_puño' }
)
Ñero.ataques.push(
  { nombre: '🗡️', id: 'ataque_navaja' },
  { nombre: '🗡️', id: 'ataque_navaja' },
  { nombre: '🗡️', id: 'ataque_navaja' },
  { nombre: '🔫', id: 'ataque_arma' },
  { nombre: '👊🏼', id: 'ataque_puño' }
)
Civil.ataques.push(
  { nombre: '👊🏼', id: 'ataque_puño' },
  { nombre: '👊🏼', id: 'ataque_puño' },
  { nombre: '👊🏼', id: 'ataque_puño' },
  { nombre: '🔫', id: 'ataque_arma' },
  { nombre: '🗡️', id: 'ataque_navaja' }
)

paquemanes.push(Tombo, Ñero, Civil);

function initgame(){
  
  sectionAtaque.style.display = 'none';
  sectionVerMapa.style.display = 'none';

  paquemanes.forEach((paqueman) => {
    opcionPaquemanes = `
    <input type="radio" name="personaje" id= ${paqueman.nombre}>
    <label class="tarjeta-personaje" for=${paqueman.nombre}>
      ${paqueman.nombre}
      <img src=${paqueman.img} alt="policia">
    </label>
    `
  
    contPersonajes.innerHTML += opcionPaquemanes;
  
    tombo = document.getElementById('Tombo');
    ñero = document.getElementById('Ñero');
    civil = document.getElementById('Civil');
  
  })
  
  personaje.addEventListener('click', seleccionPersonaje);
    
  reinicio.style.display = 'none';
  reinicio.addEventListener('click', reiniciarJuego);
}

function seleccionPersonaje(){
  sectionPersonaje.style.display = 'none';
  // sectionAtaque.style.display = 'flex';
  
  if (tombo.checked){
    jugador.innerHTML = tombo.id
    roljugador = tombo.id
  }
  else if (ñero.checked){
    jugador.innerHTML = ñero.id
    roljugador = ñero.id
  }
  else if (civil.checked){
    jugador.innerHTML = civil.id
    roljugador = civil.id
  }
  else {
    alert("Ningún personaje seleccionado")
  }
  
  extraerAtaques(roljugador);
  
  sectionVerMapa.style.display = 'flex';
  iniciarMapa();
  
  enemigo();
  
}
function enemigo(){
  let seleccion = aleatorio(0, paquemanes.length - 1)

  enemigoSelect.innerHTML = paquemanes[seleccion].nombre
  ataquesDelEnemigo = paquemanes[seleccion].nombre
}

function extraerAtaques(roljugador){
  let ataques;
  for(let i=0; i < paquemanes.length; i++){
    if(roljugador === paquemanes[i].nombre){
      ataques = paquemanes[i].ataques
    }
  }
  mostrarAtaques(ataques)
}

function mostrarAtaques(ataques){
  ataques.forEach((ataque) => {
    ataquesPersonaje = `
    <button id="${ataque.id}" class="botones_ataque arrAtaques">${ataque.nombre}</button>
    `
    contenedorAtaques.innerHTML += ataquesPersonaje;
  })
  arma = document.getElementById('ataque_arma');
  navaja = document.getElementById('ataque_navaja');
  puño = document.getElementById('ataque_puño');
  botones = document.querySelectorAll('.arrAtaques')

  secuenciaAtaques();
}

function secuenciaAtaques(){
  botones.forEach((boton) => {
    boton.addEventListener('click', (e) => {
      if (e.target.textContent === '🔫'){
        ataqueJugador.push('Disparo');
        console.log(ataqueJugador);
        boton.style.background = '#ff3838';
        boton.disabled = true;
      } else if (e.target.textContent === '🗡️'){
        ataqueJugador.push('Puñalada');
        console.log(ataqueJugador);
        boton.style.background = '#ff3838';
        boton.disabled = true;
      } else if (e.target.textContent === '👊🏼'){
        ataqueJugador.push('Golpe');
        console.log(ataqueJugador);
        boton.style.background = '#ff3838';
        boton.disabled = true;
      }
      accionEnemigo();
    })
  })
}

function accionEnemigo(){
  let ataqueAleatorio = aleatorio(0, ataquesDelEnemigo.length - 1)

  if(ataqueAleatorio == 0 || ataqueAleatorio == 1){
    ataqueEnemigo.push("Disparo");
  }
  else if(ataqueAleatorio == 3 || ataqueAleatorio == 4){
    ataqueEnemigo.push("Puñalada");
  }
  else{
    ataqueEnemigo.push("Golpe");
  }
  console.log(ataqueEnemigo)
  iniciarPelea();
};

function iniciarPelea(){
  if (ataqueJugador.length <= 5){
    situacion();
  }
}

function indexOponentes(jugador, enemigo){
  indexAtaqueJugador = ataqueJugador[jugador];
  indexAtaqueEnemigo = ataqueEnemigo[enemigo];  
}

function situacion(){
  
  for (; i < ataqueJugador.length; i++){
    if (ataqueJugador[i] === ataqueEnemigo[i]){
      indexOponentes(i, i)
      vidaJugador--;
      vidaEnemigo--;
      vistaVidaJugador.innerHTML = vidaJugador;
      vistaVidaEnemigo.innerHTML = vidaEnemigo;
      consecuencia("Empate")
    }
    else if(ataqueJugador[i] == 'Disparo' && ataqueEnemigo[i] == 'Puñalada'){
      indexOponentes(i, i)
      vidaEnemigo--;
      vistaVidaEnemigo.innerHTML = vidaEnemigo;
      consecuencia("Ganando");
    }
    else if(ataqueJugador[i] == 'Puñalada' && ataqueEnemigo[i] == 'Golpe'){
      indexOponentes(i, i)
      vidaEnemigo--;
      vistaVidaEnemigo.innerHTML = vidaEnemigo;
      consecuencia("Ganando");
    }
    else if(ataqueJugador[i] == 'Disparo' && ataqueEnemigo[i] == 'Golpe'){
      indexOponentes(i, i)
      vidaEnemigo--;
      vistaVidaEnemigo.innerHTML = vidaEnemigo;
      consecuencia("Ganando");
    }
    else{
      indexOponentes(i, i)
      vidaJugador--;
      vistaVidaJugador.innerHTML = vidaJugador;
      consecuencia("Perdiendo");
    }
  }

}
function consecuencia(estado){
  
  let newAtackPersonaje = document.createElement('p')
  let newAtackEnemigo = document.createElement('p')

  mensaje.innerHTML = estado
  newAtackPersonaje.innerHTML = indexAtaqueJugador
  newAtackEnemigo.innerHTML = indexAtaqueEnemigo

  atackPersonaje.appendChild(newAtackPersonaje)
  atackEnemigo.appendChild(newAtackEnemigo)

  mensajeFinal();

  if(vidaJugador <= 0 || vidaEnemigo <= 0 || ataqueJugador.length === 5){
    //Deshabilitar los botones de ataque
    arma.disabled = true
    navaja.disabled = true
    puño.disabled = true
    
    reinicio.style.display = 'flex';
  }
}

function revisarVidas(){
  if(vidaJugador <= 0 && vidaEnemigo <= 0){
    return "Ambos han muerto";
  }
  else if(vidaJugador <= 0){
    return "Has fallecido. Te veo en el funeral";    
  }
  else if(vidaEnemigo <= 0){
    return "Ganaste. Enemigo sin vida";
  }
  else if(ataqueJugador.length == 5){
    if(vidaEnemigo > vidaJugador){
      return "Pelea terminada, perdiste";
    }
    else if(vidaEnemigo === vidaJugador){
      return "Pelea terminada, empate";
    }
    else{
      return "Pelea terminada, ganaste";
    }
  }
  else{
    return "";
  }
}
function mensajeFinal(){
  fin = revisarVidas();

  if(fin != ""){
    mensaje.innerText = fin
  }

}

function reiniciarJuego(){
  location.reload()
}

function aleatorio(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function dibujarCanvas() {

  rolSeleccionado.x += rolSeleccionado.velocidadX
  rolSeleccionado.y += rolSeleccionado.velocidadY
  lienzo.clearRect(0,0, mapa.width, mapa.height)
  lienzo.drawImage(
    mapaBackground,
    0,
    0,
    mapa.width,
    mapa.height
  )
  lienzo.drawImage(
    rolSeleccionado.mapaImg,
    rolSeleccionado.x,
    rolSeleccionado.y,
    rolSeleccionado.ancho,
    rolSeleccionado.alto
  )
}

function moverDer() {
  rolSeleccionado.velocidadX = 5
}
function moverIzq() {
  rolSeleccionado.velocidadX = -5
}
function moverArriba() {
  rolSeleccionado.velocidadY = -5
}
function moverAbajo() {
  rolSeleccionado.velocidadY = 5
}

function detenerMovimiento() {
  rolSeleccionado.velocidadX = 0
  rolSeleccionado.velocidadY = 0
}

function teclaPresionada(event) {
  switch (event.key) {
    case 'ArrowUp':
      moverArriba();
      break
    case 'ArrowDown':
      moverAbajo();
      break
    case 'ArrowLeft':
      moverIzq();
      break
    case 'ArrowRight':
      moverDer();
      break

    default:
      break
  }
}

function iniciarMapa() {
  mapa.width = 600;
  mapa.height = 500;
  rolSeleccionado = rolObjSeleccionado();
  intervalo = setInterval(dibujarCanvas, 50);

  window.addEventListener('keydown', teclaPresionada);
  window.addEventListener('keyup', detenerMovimiento);
}

function rolObjSeleccionado() {
  for(let i=0; i < paquemanes.length; i++){
    if(roljugador === paquemanes[i].nombre){
      return paquemanes[i]
    }
  }
}

window.addEventListener('DOMContentLoaded', initgame)