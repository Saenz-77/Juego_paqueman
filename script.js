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

const anchoMaximo = 550

let jugadorId = null
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
let TomboEnemigo;
let ÑeroEnemigo;
let CivilEnemigo;
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
let alturaMapa;
let anchuraMapa = window.innerWidth - 20;

if(anchuraMapa > anchoMaximo) {
  anchuraMapa = anchoMaximo - 20;
}
alturaMapa = anchuraMapa * 600 / 800

mapa.width = anchuraMapa
mapa.height = alturaMapa


class Paqueman {
  constructor(nombre, img, vida, mapaImg, id = null){
    this.nombre = nombre
    this.img = img
    this.vida = vida
    this.id = id
    this.ataques = []
    this.ancho = 40
    this.alto = 40
    this.x = aleatorio(10, mapa.width - this.ancho)
    this.y = aleatorio(10, mapa.height - this.alto)
    this.mapaImg = new Image()
    this.mapaImg.src = mapaImg
    this.velocidadX = 0
    this.velocidadY = 0
  }

  dibujarRol() {
    lienzo.drawImage(
      this.mapaImg,
      this.x,
      this.y,
      this.ancho,
      this.alto
    )
  }
}

let Tombo = new Paqueman('Tombo', './img/tombo.png', 4, './img/caretombo.png');
let Ñero = new Paqueman('Ñero', './img/ñero.png', 4, './img/careñero.png');
let Civil = new Paqueman('Civil', './img/civil.png', 4, './img/carecivil.png');

const ATAQUES_TOMBO = [
  { nombre: '🔫', id: 'ataque_arma' },
  { nombre: '🔫', id: 'ataque_arma' },
  { nombre: '🔫', id: 'ataque_arma' },
  { nombre: '🗡️', id: 'ataque_navaja' },
  { nombre: '👊🏼', id: 'ataque_puño' }
]
const ATAQUES_ÑERO = [
  { nombre: '🗡️', id: 'ataque_navaja' },
  { nombre: '🗡️', id: 'ataque_navaja' },
  { nombre: '🗡️', id: 'ataque_navaja' },
  { nombre: '🔫', id: 'ataque_arma' },
  { nombre: '👊🏼', id: 'ataque_puño' }
]
const ATAQUES_CIVIL = [
  { nombre: '👊🏼', id: 'ataque_puño' },
  { nombre: '👊🏼', id: 'ataque_puño' },
  { nombre: '👊🏼', id: 'ataque_puño' },
  { nombre: '🔫', id: 'ataque_arma' },
  { nombre: '🗡️', id: 'ataque_navaja' }
]

Tombo.ataques.push(...ATAQUES_TOMBO)
Ñero.ataques.push(...ATAQUES_ÑERO)
Civil.ataques.push(...ATAQUES_CIVIL)

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

  unirseAlJuego()
}

function unirseAlJuego() {
  fetch('http://localhost:8080/unirse')
    .then(function (response) {
      if(response.ok) {
        response.text()
          .then(function (respuesta) {
            console.log(respuesta)
            jugadorId = respuesta
          })
      }
    })
}

function seleccionPersonaje(){
  sectionPersonaje.style.display = 'none';
  
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
  
  PersonajeSeleccionado(roljugador)

  extraerAtaques(roljugador);
  
  sectionVerMapa.style.display = 'flex';
  iniciarMapa();
}

function PersonajeSeleccionado(roljugador) {
  fetch(`http://localhost:8080/paqueman/${jugadorId}`, {
    method: 'post',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      paqueman: roljugador
    })
  })
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

function seleccionEnemigo(enemigo){
  enemigoSelect.innerHTML = enemigo.nombre
  ataquesDelEnemigo = enemigo.ataques
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
  rolSeleccionado.dibujarRol()

  enviarPosicion(rolSeleccionado.x, rolSeleccionado.y)

  TomboEnemigo.dibujarRol()
  ÑeroEnemigo.dibujarRol()
  CivilEnemigo.dibujarRol()

  if(rolSeleccionado.velocidadX !== 0 || rolSeleccionado.velocidadY !== 0) {
    revisarColision(TomboEnemigo)
    revisarColision(ÑeroEnemigo)
    revisarColision(CivilEnemigo)
  }
}

function enviarPosicion(x, y) {
  fetch(`http://localhost:8080/paqueman/${jugadorId}/posicion`, {
    method: 'post',
    headers: {
      'content-Type': 'application/json'
    },
    body: JSON.stringify({
      x, // es igual a x : x
      y // es igual a y : y
    })
  })
  .then(function (response) {
    if(response.ok) {
      response.json()
        .then(function ({enemigos}) {  // == .then(function (respuesta) { respuesta.enemigos }
          console.log(enemigos)
          
          enemigos.forEach(function(enemigo) {
            let paquemanEnemigo = null
            const paquemanNombre = enemigo.nombre || ''
            
            if (paquemanNombre === 'Tombo') {
              paquemanEnemigo = new Paqueman('Tombo', './img/tombo.png', 4, './img/caretombo.png', );
            }
            else if(paquemanNombre === 'Ñero') {
              paquemanEnemigo = new Paqueman('Ñero', './img/ñero.png', 4, './img/careñero.png');
            }
            else if(paquemanNombre === 'Civil') {
              paquemanEnemigo = new Paqueman('Civil', './img/civil.png', 4, './img/carecivil.png');
            }
            
            paquemanEnemigo.x = enemigo.x
            paquemanEnemigo.y = enemigo.y
            paquemanEnemigo.dibujarRol()
            
          })

        })
    }
  })
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

function revisarColision(enemigo) {

  const arribaEnemigo = enemigo.y
  const abajoEnemigo = enemigo.y + enemigo.alto
  const derEnemigo = enemigo.x + enemigo.ancho
  const izqEnemigo = enemigo.x

  const arribaPersonaje = rolSeleccionado.y
  const abajoPersonaje = rolSeleccionado.y + rolSeleccionado.alto
  const derPersonaje = rolSeleccionado.x + rolSeleccionado.ancho
  const izqPersonaje = rolSeleccionado.x

  if(
    abajoPersonaje < arribaEnemigo ||
    arribaPersonaje > abajoEnemigo ||
    derPersonaje < izqEnemigo ||
    izqPersonaje > derEnemigo
  ) {
    return
   
  }
  detenerMovimiento();
  clearInterval(intervalo);
  sectionAtaque.style.display = 'flex';
  sectionVerMapa.style.display = 'none';
  seleccionEnemigo(enemigo);
}

window.addEventListener('DOMContentLoaded', initgame)