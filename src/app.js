'use strict'

const express = require('express')
const bodyParser = require('body-parser')

const mainRouter = require('./routes/main.routes')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', mainRouter)
app.use('/cdn', express.static('public'))

module.exports = app

const port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port', port)
