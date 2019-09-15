const mongoose = require('mongoose')
const {playing, deleteBadMoves} = require('./game')
mongoose.Promise = global.Promise
const Moves = require('./models/moves');


//CONECTA NO BANCO DE DADOS
mongoose.connect('mongodb://localhost/game', {useNewUrlParser: true})
.then(() => {
    console.log('conectou ao banco!')
})
.catch((e) =>{
    console.log(`Erro: ${e}`)
})

//JOGA CONTRA SI MESMO E ARMAZENA RESULTADOS
//playing()

//TIRA JOGADAS RUINS
deleteBadMoves()
