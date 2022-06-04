'use strict'

// const middleWare = require('../middleware/player.middleware')
const handlers = require('../controllers/routes.controllers')
const controllers = require('../controllers/game.controllers')
const users = require('../controllers/user.controllers')
const express = require('express')
const router = express.Router()
const userMiddleware = require('../middleware/user.middleware')

const auth = userMiddleware.auth

// Static routes
router.get('/game', auth, controllers.validatedGame, handlers.game)
router.get('/', handlers.splash)
router.get('/createAccount', handlers.createAccount)
// API routes
router.post('/api/guess', auth, handlers.guessController.colourCodeGuess)
router.post('/api/correct', auth, handlers.guessController.revealWord)
router.post('/api/user', users.makeNewUser)
router.get('/api/user', auth, function (req, res) { // to test authentication
  res.status(200).json({
    code: 'ok',
    message: 'Authenticated',
    username: req.user.username
  })
})

router.post('/api/login', users.login)

router.get('/api/game', auth, async function (req, res) {
  res.json({
    game: await controllers.generateGame(req.user),
    code: 'ok'
  })
})

router.get('/api/multiplayer', auth, async function (req, res) {
  res.json({
    game: await controllers.generateGame(req.user, 'multiplayer'),
    code: 'ok'
  })
})

router.post('/api/game/log', auth, controllers.getGameLog)

router.post('/api/multiplayer/lobby', auth, controllers.multiplayerLobby)

router.post('/api/multiplayer/join', auth, controllers.multiplayerJoin)

router.post('/api/multiplayer/start', auth, controllers.multiplayerStart)

router.post('/api/game/channel', auth, controllers.gameChannel)

module.exports = router
