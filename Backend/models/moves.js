const { Schema, model } = require('mongoose')

const movesSchema = Schema({
    moves: [[]]
})

module.exports = model('moves', movesSchema)