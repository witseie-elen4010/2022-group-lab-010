'use strict'

const handlers = require('./handlers')
const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

router.get('/', handlers.hello)
router.get('/game', handlers.game)

router.post('/api/guess', handlers.guessController.colourCodeGuess)



module.exports = router
