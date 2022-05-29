'use strict'

const handlers = require('../controllers/routes.controllers')
const controllers = require('../controllers/game.controllers')
const users = require('../controllers/user.controllers')
const express = require('express')
const router = express.Router()

router.get('/game', handlers.game)
router.post('/api/guess', handlers.guessController.colourCodeGuess)
router.post('/api/correct', handlers.guessController.revealWord)
router.post('/api/user', users.makeNewUser)

router.get('/api/game', async function (req, res) {
  res.json({
    game: await controllers.generateGame(),
    code: 'ok'
  })
})

router.get('/', handlers.splash)

module.exports = router
