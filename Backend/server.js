const express =  require('express')
const cors = require('cors')
const routes = require('./routes')
const mongoose = require('mongoose')

mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost/game', {useNewUrlParser: true})
.then(console.log('==conectou ao banco==')).catch((err)=>{console.log(err)})

const app = express()
app.use(express.json())
app.use(cors())

app.use(routes)


app.listen(8080, () => {
    console.log('---Server no ar---')
})