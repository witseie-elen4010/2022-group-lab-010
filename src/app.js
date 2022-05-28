'use strict'

const express = require('express')
require('dotenv').config({ path: '../.env' })
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const mainRouter = require('./routes/main.routes')

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', mainRouter)
app.use('/cdn', express.static('public'))

module.exports = app

// Configure Database connection
const mongoDB = 'mongodb://' + process.env.DB_HOST + ':' + process.env.DB_PORT + '/' + process.env.DB_NAME
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection

db.on('error', console.error.bind(console, 'MongoDB connection error:'))

/* const mongoDBUsers = process.env.DB_URI
mongoose.connect(mongoDBUsers, { useUnifiedTopology: true, useNewUrlParser: true })
const dbUser = mongoose.connection

dbUser.once('open', () => {
  console.log('connected to mongo user database')
})

dbUser.on('error', console.error.bind(console, 'MongoDB connection error to User:')) */

const port = process.env.PORT || 3000
app.listen(port)
console.log('Express server running on port', port)
