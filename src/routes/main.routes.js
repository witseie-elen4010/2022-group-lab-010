'use strict'

const handlers = require('../controllers/routes.controllers')
const controllers = require('../controllers/game.controllers')
const express = require('express')
const router = express.Router()

router.get('/game', handlers.game)
router.post('/api/guess', handlers.guessController.colourCodeGuess)
router.get('/api/correct', function (req, res) {
  res.json(controllers.getCorrectWord()) // Respond with JSON
})
router.get('/api/correct', function (req, res) {
  res.json(controllers.getCorrectWord) // Respond with JSON
})
router.get('/', handlers.splash)

module.exports = router
