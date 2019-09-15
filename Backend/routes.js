const express = require('express')
const movesController = require('./controllers/movesController')
const routes = express.Router()

//MANDA UM ARRAY E RECEBE UM OBJETO DE ARRAYS
routes.post('/move', movesController.index)

//DELETA UMA JOGADA RUIM
routes.post('/badmove', movesController.delete)

module.exports = routes