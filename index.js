const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

const jugadores = []

class Jugador {
  constructor(ide) {
    this.id = ide
  }

  asignarPaqueman(personaje) {
    this.paqueman = personaje
  }
  actualizarPosicion(x, y) {
    this.x = x
    this.y = y
  }
}

class Paqueman {
  constructor(nombreP) {
    this.nombre = nombreP
  }
}

app.get('/unirse', (require, response) => {
  const id = `${Math.random()}`
  const jugador = new Jugador(id)

  jugadores.push(jugador)

  response.setHeader('Access-Control-Allow-Origin', '*')

  response.send(id)
})

app.post('/paqueman/:jugadorId', (require, response) => {
  const jugadorId = require.params.jugadorId || 'Algo paso'
  const nombre = require.body.paqueman || ''
  const paqueman = new Paqueman(nombre)
  
  const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)
  
  if (jugadorIndex >= 0) {
    jugadores[jugadorIndex].asignarPaqueman(paqueman)
  }
  
  console.log(jugadores)
  console.log(jugadorId)
  response.end()
})

app.post('/paqueman/:jugadorId/posicion', (require, response) => {
  const jugadorId = require.jugadorId || ''
  const x = require.body.x || 0
  const y = require.body.y || 0

  const jugadorIndex = jugadores.findIndex((jugador) => jugadorId === jugador.id)
  
  if (jugadorIndex >= 0) {
    jugadores[jugadorIndex].actualizarPosicion
  }

  const enemigos = jugadores.filter((jugador) => jugadorId != jugador.id)

  response.send({
    enemigos
  })
})

app.listen(8080, () => {
  console.log('Servidor corriendo')
})