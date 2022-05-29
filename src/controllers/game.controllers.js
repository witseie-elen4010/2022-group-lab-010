'use strict'
const Game = require('../models/Game')
const Word = require('../models/Word')

const getGame = async (gameId) => {
  const game = await Game
    .findById(gameId)
    .populate('word')
  if (game) {
    return game
  }
  return false
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

const wordIsValid = async (word) => {
  word = word.toLowerCase()
  if (word.length !== 5) return false
  return await Word.exists({ word })
}

module.exports = {
  wordIsValid,
  generateGame,
  getGame
}
