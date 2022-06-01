'use strict'
const Game = require('../models/Game')
const Word = require('../models/Word')

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
  if (!(gameObj = await getGame(post.game))) {
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

const generateGame = async (gameMode = 'practice') => {
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
    gameMode
  }

  const result = await Game.create(game)

  return result._id
}

const getGame = async (gameId) => {
  const game = await Game
    .findById(gameId)
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

module.exports = {
  wordIsValid,
  generateGame,
  getGame,
  getGameLog

}
