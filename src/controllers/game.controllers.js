'use strict'
const Game = require('../models/Game')
const Word = require('../models/Word')
const hash = require('../public/scripts/hash')

const getGameLog = async (req, res) => {
  const post = req.body
  if (!post) {
    res.status(400).send({
      message: 'Invalid Request Body',
      code: 'error'
    })
    res.end()
    return
  }

  let gameObj
  if (!(gameObj = await getGame(req.user, post.game))) {
    res.status(400).send({
      message: "The 'game' parameter is invalid.",
      code: 'error'
    })
    return
  }

  // check if game is complete
  if (!gameObj.complete) {
    res.status(400).send({
      message: 'The game has not yet completed.',
      code: 'error'
    })
    return
  }

  const game = gameObj.toObject()

  let log = {}

  log = {
    correctWord: game.word.word.toUpperCase(),
    start: game.createdAt,
    end: game.completedAt,
    guesses: game.guesses,
    score: game.score,
    gameMode: game.gameMode
  }

  // delete _id field from guesses
  log.guesses.forEach(obj => {
    delete obj._id
  })

  res.json({
    code: 'ok',
    log
  })
}

const generateGame = async (owner, gameMode = 'practice') => {
  // Get a random word from the database
  const word = await Word.count()
    .exec()
    .then(async count => {
      const random = Math.floor(Math.random() * count)
      return await Word.findOne().skip(random).exec()
        .then(res => {
          return res
        })
    })

  const game = {
    word: word._id,
    guesses: [],
    gameMode,
    players: [{ player: owner._id }]
  }

  const result = await Game.create(game)
  const code = await result.generateCode()
  return code
}

const multiplayerStart = async (req, res) => {
  const post = req.body
  if (!post || !post.game) {
    res.status(400).json({ code: 'error', message: 'Invalid Game' })
    return
  }

  let game
  if (!(game = await Game.findOne({ code: post.game }).exec())) {
    res.status(400).json({ code: 'error', message: 'Invalid Game' })
    return
  }

  // check if player is the owner
  if (!game.players.length === 0 || game.players[0].player.toString() !== req.user._id.toString()) {
    res.status(400).json({ code: 'error', message: 'Not the owner' })
    return
  }

  // notify players of game begin
  global.events.emit('multiplayerLobby' + game.code,
    { type: 'start' }
  )

  res.status(200).json({
    code: 'ok',
    message: 'Notified players of game start'
  })
}

const multiplayerJoin = async (req, res) => {
  const post = req.body
  if (!post || !post.game) {
    res.status(400).json({ code: 'error', message: 'Invalid Game' })
    return
  }

  let game
  if (!(game = await Game.findOne({ code: post.game }).exec())) {
    res.status(400).json({ code: 'error', message: 'Invalid Game' })
    return
  }

  // check if player already in game
  if (game.players.some(obj => obj.player.toString() === req.user._id.toString())) {
    res.status(400).json({ code: 'error', message: 'Player already in game' })
    return
  }

  // add the player to the game
  const player = { player: req.user._id }
  game.players.push(player)
  await game.save()

  // notify other players of new user
  global.events.emit('multiplayerLobby' + game.code, { type: 'player', player: req.user.username })

  const players = await getGamePlayers(game.code)

  res.status(200).json({
    code: 'ok',
    players,
    status: 'wait'
  })
}

const getGamePlayers = async (gameId) => {
  const game = await Game.findOne({ code: gameId }).populate('players.player')
  const players = []
  game.players.forEach(player => {
    players.push({ username: player.player.username })
  })

  return players
}

const multiplayerLobby = async (req, res) => {
  const post = req.body
  if (!post || !post.game) {
    res.status(400).json({ code: 'error', message: 'Invalid Game' })
    return
  }

  let game
  if (!(game = await Game.findOne({ code: post.game }).exec())) {
    res.status(400).json({ code: 'error', message: 'Invalid Game' })
    return
  }

  // check hash against database
  if (typeof post.hash !== 'undefined') {
    const players = await getGamePlayers(game.code)
    if (post.hash !== hash.objectArrayHash(players)) {
      res.status(200).json({ // send a update
        code: 'ok',
        status: 'update',
        players
      })
      return
    }
  }

  let newPlayer = ''

  // wait for lobby update (new player)
  await new Promise(resolve =>

    global.events.once('multiplayerLobby' + game.code, (event) => {
      if (event.type === 'player') {
        newPlayer = event.player
        res.status(200).json({
          code: 'ok',
          status: 'change',
          player: { username: newPlayer }
        })
      } else if (event.type === 'start') {
        res.status(200).json({
          code: 'ok',
          status: 'begin'
        })
      }
      resolve()
    })
  )
}

const getGame = async (user, gameId) => {
  const game = await Game
    .findOne({ code: gameId, player: user._id })
    .populate('word')
    .catch(() => false)
  if (game) {
    return game
  }
  return false
}

const wordIsValid = async (word) => {
  word = word.toLowerCase()
  if (word.length !== 5) return false
  return await Word.exists({ word })
}

const invalidGame = (req, res) => {
  res.status(400)

  if (req.accepts('html')) {
    res.redirect('/') // redirect to login
  } else if (req.accepts('json')) {
    res.json({ code: 'error', message: 'Invalid game' })
  }

  return false
}

const validatedGame = async (req, res, next) => {
  if (!req.query.code) {
    return invalidGame(req, res)
  }

  let game
  if (!(game = await Game.findOne({ code: req.query.code }).exec())) {
    return invalidGame(req, res)
  }

  // check if user is apart of the game
  if (game.players.some(obj => obj.player.toString() === req.user._id.toString())) {
    next()
  } else {
    return invalidGame(req, res)
  }
}

const multiplayerGame = async (req, res) => {
  const post = req.body
  if (!post || !post.game) {
    res.status(400).json({ code: 'error', message: 'Invalid Game' })
    return
  }

  let game
  if (!(game = await Game.findOne({ code: post.game }).exec())) {
    res.status(400).json({ code: 'error', message: 'Invalid Game' })
    return
  }

  // check hash against database
  if (typeof post.hash !== 'undefined') {
    const players = await getGamePlayers(game.code)
    if (post.hash !== hash.objectArrayHash(players)) {
      res.status(200).json({ // send a update
        code: 'ok',
        status: 'update',
        players
      })
      return
    }
  }

  let newPlayer = ''

  // wait for lobby update (new player)
  await new Promise(resolve =>

    global.events.once('multiplayerLobby' + game.code, (event) => {
      if (event.type === 'player') {
        newPlayer = event.player
        res.status(200).json({
          code: 'ok',
          status: 'change',
          player: { username: newPlayer }
        })
      } else if (event.type === 'start') {
        res.status(200).json({
          code: 'ok',
          status: 'begin'
        })
      }
      resolve()
    })
  )
}

module.exports = {
  wordIsValid,
  generateGame,
  getGame,
  getGameLog,
  multiplayerJoin,
  multiplayerLobby,
  multiplayerStart,
  validatedGame,
  multiplayerGame
}
