'use strict'

const express = require('express')
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', indexRouter)
app.use('/cdn', express.static('public'))

module.exports = app

const port = 3000
app.listen(port)
console.log('Express server running on port', port)
