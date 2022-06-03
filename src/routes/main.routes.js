'use strict'

const middleWare = require('../middleware/player.middleware')
const handlers = require('../controllers/routes.controllers')
const controllers = require('../controllers/game.controllers')
const users = require('../controllers/user.controllers')
const express = require('express')
const router = express.Router()

// Static routes
router.get('/game', middleWare.auth, handlers.game)
router.get('/', middleWare.auth2, handlers.login)
router.get('/splash', middleWare.auth, handlers.splash)
router.get('/login', middleWare.auth2, handlers.login)
router.get('/createAccount', handlers.createAccount)
// API routes
router.post('/api/guess', handlers.guessController.colourCodeGuess)
router.post('/api/correct', handlers.guessController.revealWord)
router.post('/api/user', users.makeNewUser)
router.post('/api/LogIn', users.logginIn)
router.get('/api/game', middleWare.auth, async function (req, res) {
  res.json({
    game: await controllers.generateGame(),
    code: 'ok'
  })
})
router.get('/api/multiplayer', middleWare.auth, async function (req, res) {
  res.json({
    game: await controllers.generateGame('multiplayer'),
    code: 'ok'
  })
})

router.post('/api/game/log', controllers.getGameLog)

module.exports = router
