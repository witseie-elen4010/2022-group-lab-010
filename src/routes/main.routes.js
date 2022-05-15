'use strict'

const handlers = require('../controllers/routes.controllers')
const express = require('express')
const router = express.Router()

router.get('/game', handlers.game)
router.post('/api/guess', handlers.guessController.colourCodeGuess)
router.get('/', handlers.splash)

module.exports = router
