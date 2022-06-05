'use strict'
const Game = require('../models/Game')
const Word = require('../models/Word')
const hash = require('../public/scripts/hash')

const getGameLog = async (req, res) => {
  const post = req.body

  const gameObj = await Game.findOne({ code: post.game, player: req.user._id }).populate('word guesses.player players.player')
  if (!post || !post.game || !gameObj) {
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

  const players = []
  const guesses = []

  // filter data
  game.players.forEach(player => {
    players.push({ player: player.player.username, score: player.score })
  })

  game.guesses.forEach(guess => {
    guesses.push({ player: guess.player.username, guess: guess.guess, colours: guess.colours, score: guess.score, date: guess.date })
  })

  let log = {}

  const winner = game.winner === '' ? 'No one guessed the word' : game.winner

  log = {
    correctWord: game.word.word.toUpperCase(),
    start: game.createdAt,
    end: game.completedAt,
    guesses,
    players,
    gameMode: game.gameMode,
    winner
  }
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

  let game
  if (!post || !post.game || !(game = await Game.findOne({ code: post.game }).exec())) {
    res.status(400).json({ code: 'error', message: 'Invalid Game' })
    return
  }

  // check if player is the owner
  if (!game.players.length === 0 || game.players[0].player.toString() !== req.user._id.toString()) {
    res.status(400).json({ code: 'error', message: 'Not the owner' })
    return
  }

  game.started = true
  await game.save()

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

  let game
  if (!post || !post.game || !(game = await Game.findOne({ code: post.game }).exec())) {
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
    players.push({ username: player.player.username, score: player.score })
  })

  return players
}

const multiplayerLobby = async (req, res) => {
  const post = req.body

  let game
  if (!post || !post.game || !(game = await Game.findOne({ code: post.game }).exec())) {
    res.status(400).json({ code: 'error', message: 'Invalid Game' })
    return
  }

  // check hash against database
  if (typeof post.hash !== 'undefined') {
    const players = await getGamePlayers(game.code)
    const customWord = game.gameMode === 'custom-word'
    const state = { players, customWord }
    if (post.hash !== hash.objectArrayHash(state)) {
      res.status(200).json({ // send a update
        code: 'ok',
        status: 'update',
        state
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
      } else if (event.type === 'gameMode') {
        res.status(200).json({
          code: 'ok',
          status: 'custom-word'
        })
      }
      resolve()
    })
  )
}

const getGame = async (user, gameId) => {
  const game = await Game.findOne({ code: gameId, player: user._id }).populate('word').catch(() => false)
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
  let game
  if (!req.query || !req.query.code || !(game = await Game.findOne({ code: req.query.code }).exec())) {
    return invalidGame(req, res)
  }

  // check if user is apart of the game
  if (game.players.some(obj => obj.player.toString() === req.user._id.toString())) {
    next()
  } else {
    return invalidGame(req, res)
  }
}

const getMultiplayerState = async (userId, gameId) => {
  const game = await Game.findOne({ code: gameId }).populate('guesses.player players.player')
  const guesses = []
  let score = 0
  let g
  game.guesses.forEach(guess => {
    g = {
      player: guess.player.username,
      colours: guess.colours
    }

    if (userId.toString() === guess.player._id.toString()) {
      g.guess = guess.guess
      score += guess.score
    }

    guesses.push(g)
  })

  const players = []
  game.players.forEach(player => {
    if (player.player._id.toString() !== userId.toString()) {
      players.push({ username: player.player.username, score: player.score })
    }
  })

  return { score, players, guesses, complete: game.complete }
}

const gameChannel = async (req, res) => {
  const post = req.body
  let game
  if (!post || !post.game || !(game = await getGame(req.user._id, post.game))) {
    res.status(400).json({ code: 'error', message: 'Invalid Game' })
    return
  }

  // check hash against database
  if (typeof post.hash !== 'undefined') {
    const state = await getMultiplayerState(req.user._id, game.code)
    if (post.hash !== hash.objectArrayHash(state)) {
      res.status(200).json({ // send a update
        code: 'ok',
        status: 'update',
        state
      })
      return
    }
  }

  // wait for lobby update (new guess)
  await new Promise(resolve =>
    global.events.once('gameChannel' + game.code, (event) => {
      if (event.type === 'guess') {
        res.status(200).json({
          code: 'ok',
          status: 'change',
          guess: event.guess
        })
      } else if (event.type === 'end') {
        res.status(200).json({
          code: 'ok',
          status: 'end',
          guess: event.guess
        })
      }
      resolve()
    })
  )
}

const customWord = async (req, res) => {
  if (!(req.body || req.body.word)) {
    res.status(400).json({
      code: 'error',
      message: 'invalid body'
    })
    return
  }

  const post = req.body
  let playerGame
  if (!post.game || !(playerGame = await getGame(req.user, post.game))) {
    res.status(400).send({
      message: 'Error: Invalid Game',
      code: 'error'
    })
    return
  }

  const word = req.body.word
  const test = await wordIsValid(word)
  if (test) {
    playerGame.word = test._id
    playerGame.gameMode = 'custom-word'

    // notify lobby
    global.events.emit('multiplayerLobby' + playerGame.code,
      { type: 'gameMode', gameMode: 'custom-word' }
    )

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
}

module.exports = {
  customWord,
  wordIsValid,
  generateGame,
  getGame,
  getGameLog,
  multiplayerJoin,
  multiplayerLobby,
  multiplayerStart,
  validatedGame,
  gameChannel
}
