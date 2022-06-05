'use strict'

// ignore file for jest coverage because the server is simulated
/// with super test
/* istanbul ignore file */

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

router.post('/api/changeDetails', auth, users.changeUserDetails)

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

router.post('/api/game/word', auth, async function (req, res) {
  if (!(req.body || req.body.word)) {
    res.status(400).json({
      code: 'error',
      message: 'invalid body'
    })
    return
  }

  const post = req.body
  let playerGame
  if (!post.game || !(playerGame = await controllers.getGame(req.user, post.game))) {
    res.status(400).send({
      message: 'Error: Invalid Game',
      code: 'error'
    })
    return
  }

  const word = req.body.word
  const test = await controllers.wordIsValid(word)
  if (test) {
    playerGame.word = test._id
    await playerGame.save()

    res.json({
      message: 'Word is valid',
      code: 'ok'
    })
  } else {
    res.status(400).send({
      message: 'Error: Word not found in dictionary',
      code: 'error'
    })
  }
})

router.post('/api/game/log', auth, controllers.getGameLog)

router.post('/api/multiplayer/lobby', auth, controllers.multiplayerLobby)

router.post('/api/multiplayer/join', auth, controllers.multiplayerJoin)

router.post('/api/multiplayer/start', auth, controllers.multiplayerStart)

router.post('/api/game/channel', auth, controllers.gameChannel)

module.exports = router
