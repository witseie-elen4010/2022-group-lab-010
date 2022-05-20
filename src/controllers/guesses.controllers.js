'use strict'

const game = require('./game.controllers')

const colourCodeGuess = (req, res) => {
  // load request parameters from JSON body
  const post = req.body
  const correctWord = game.getCorrectWord()

  if (!post || !post.guess || post.guess.length !== 5) {
    res.status(400).send({
      message: "The 'guess' parameter is invalid.",
      code: 'error'
    })
    return
  } else if (!game.wordIsValid(post.guess)) {
    res.status(400).send({
      message: "The 'guess' parameter was not found in the dictionary.",
      code: 'error'
    })
    return
  }

  const guess = post.guess.toUpperCase()

  const out = { code: 'ok', colour: [] } // output array

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

  res.setHeader('Content-Type', 'application/json')
  res.send(out)
}

module.exports = { colourCodeGuess }
