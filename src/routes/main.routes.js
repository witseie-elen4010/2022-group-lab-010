'use strict'

const handlers = require('../controllers/routes.controllers')
const controllers = require('../controllers/game.controllers')
const users = require('../controllers/user.controllers')
const express = require('express')
const router = express.Router()
const userMiddleware = require('../middleware/user.middleware')

const auth = userMiddleware.auth

// Static routes
router.get('/game', auth, handlers.game)
router.get('/', handlers.splash)

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

module.exports = router
