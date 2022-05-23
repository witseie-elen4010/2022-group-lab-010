'use strict'

const game = require('./game.controllers')

const revealWord = async (req, res) => {
  const post = req.body
  if (!post) {
    res.status(400).send({
      message: 'Invalid Request Body',
      code: 'error'
    })
    res.end()
    return
  }

  let playerGame
  if (!(playerGame = await game.getGame(post.game))) {
    res.status(400).send({
      message: "The 'game' parameter is invalid.",
      code: 'error'
    })
    return
  }

  res.json({
    word: playerGame.word.toUpperCase()
  })
}

const colourCodeGuess = async (req, res) => {
  // load request parameters from JSON body
  const post = req.body
  if (!post) {
    res.status(400).send({
      message: 'Invalid Request Body',
      code: 'error'
    })
    res.end()
    return
  }

  let playerGame

  if (!post.game || !(playerGame = await game.getGame(post.game))) {
    res.status(400).send({
      message: 'Error: Invalid Game',
      code: 'error'
    })
    return
  }

  const correctWord = playerGame.word.toUpperCase()

  if (!post.guess || post.guess.length !== 5) {
    res.status(400).send({
      message: 'Invalid Guess',
      code: 'error'
    })
    return
  }
  if (!await game.wordIsValid(post.guess)) {
    res.status(400).send({
      message: post.guess + ' is not a valid word',
      code: 'error'
    })
    return
  }

  const guess = post.guess.toUpperCase()

  const out = { code: 'ok', colour: [], guess } // output array

  for (let i = 0; i < post.guess.length; i++) {
    const letter = guess.charAt(i)

    // Score each letter
    if (letter === correctWord.charAt(i)) {
      out.colour.push('green')
    } else if (correctWord.indexOf(letter) > -1) {
      out.colour.push('yellow')
    } else {
      out.colour.push('gray')
    }
  }

  res.json(out)
}

module.exports = { colourCodeGuess, revealWord }
