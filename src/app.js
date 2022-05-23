'use strict'

const express = require('express')
require('dotenv').config({ path: '../.env' })
const bodyParser = require('body-parser')
const mainRouter = require('./routes/main.routes')
const db = require('./db')
const { default: mongoose } = require('mongoose')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', mainRouter)
app.use('/cdn', express.static('public'))

console.log('Connecting to database...')
db.connect()

mongoose.connection.on('error', () => {
  console.error.bind(console, 'MongoDB connection error:')
  process.exit(1)
})

module.exports = app

const port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port', port)
