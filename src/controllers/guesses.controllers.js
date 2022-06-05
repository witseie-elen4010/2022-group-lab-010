'use strict'

const game = require('./game.controllers')

const revealWord = async (req, res) => {
  const post = req.body

  let playerGame
  if (!post || !post.game || !(playerGame = await game.getGame(req.user, post.game))) {
    res.status(400).send({
      message: "The 'game' parameter is invalid.",
      code: 'error'
    })
    return
  }

  // check if game is over
  if (!playerGame.complete) {
    res.status(400).send({
      message: 'The game has not yet completed.',
      code: 'error'
    })
    return
  }

  res.json({
    word: playerGame.word.word.toUpperCase()
  })
}

const scoreFunction = (guessesMade, colours) => {
  let score = 0
  for (let i = 0; i < colours.length; i++) {
    if (colours[i] === 'green') {
      score = score + 4 * (6 - guessesMade) ** 2
    } else if (colours[i] === 'yellow') {
      score = score + (6 - guessesMade) ** 2
    }
  }
  return score
}

const colourCodeGuess = async (req, res) => {
  // load request parameters from JSON body
  const post = req.body
  let playerGame
  if (!post || !post.game || !(playerGame = await game.getGame(req.user, post.game))) {
    res.status(400).send({
      message: 'Error: Invalid Game',
      code: 'error'
    })
    return
  }

  // check if game is complete, then no more guesses
  if (playerGame.complete) {
    res.status(400).send({
      message: 'The game has completed',
      code: 'error'
    })
    return
  }

  // check if game has started for multiplayer
  if (playerGame.gameMode === 'multiplayer' && !playerGame.started) {
    res.status(400).send({
      message: 'The game has not yet started',
      code: 'error'
    })
    return
  }

  const correctWord = playerGame.word.word.toUpperCase()

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
  let score = 0
  const out = { code: 'ok', colour: ['gray', 'gray', 'gray', 'gray', 'gray'], guess, score } // output array
  let allGreen = true

  let available = correctWord
  // mark green
  for (let i = 0; i < post.guess.length; i++) {
    const letter = guess.charAt(i)
    if (letter === correctWord[i]) {
      out.colour[i] = 'green'
      const index = available.indexOf(letter)
      // remove letter from available
      available = available.slice(0, index) + available.slice(index + 1)
    } else {
      allGreen = false
    }
  }

  // mark yellow
  for (let i = 0; i < post.guess.length; i++) {
    const letter = guess.charAt(i)
    if (out.colour[i] !== 'green' && available.indexOf(letter) > -1) {
      out.colour[i] = 'yellow'
      const index = available.indexOf(letter)
      // remove letter from available
      available = available.slice(0, index) + available.slice(index + 1)
    }
  }

  // count the number of turns for the player
  const turn = playerGame.guesses.filter(guess =>
    guess.player.toString() === req.user._id.toString()
  ).length

  score = scoreFunction(turn, out.colour)

  out.score = score

  // log the player's guess
  playerGame.guesses.push({
    guess,
    colours: out.colour,
    score,
    player: req.user._id
  })

  // update the total score
  // get the current player
  const currentPlayer = playerGame.players.filter(elem => elem.player.toString() === req.user._id.toString())[0]
  currentPlayer.score += score

  if (allGreen || playerGame.guesses.length === playerGame.players.length * 6) {
    global.events.emit('gameChannel' + playerGame.code, {
      type: 'end',
      guess: {
        player: req.user.username,
        colours: out.colour
      }
    })

    if (allGreen) { playerGame.winner = req.user.username }
    playerGame.complete = true
    playerGame.completedAt = Date.now()
    playerGame.markModified('completedAt')
  } else {
    global.events.emit('gameChannel' + playerGame.code, {
      type: 'guess',
      guess: {
        player: req.user.username,
        colours: out.colour
      }
    })
  }

  await playerGame.save() // save to database

  res.json(out)
}

module.exports = { colourCodeGuess, revealWord }
