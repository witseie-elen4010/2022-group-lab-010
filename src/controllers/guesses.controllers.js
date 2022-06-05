'use strict'

const game = require('./game.controllers')

const revealWord = async (req, res) => {
  const post = req.body
  // if (!post) {
  //   res.status(400).send({
  //     message: 'Invalid Request Body',
  //     code: 'error'
  //   })
  //   res.end()
  //   return
  // }

  let playerGame
  if (!(playerGame = await game.getGame(req.user, post.game))) {
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

const countOcurrences = (str, value) => {
  const regExp = new RegExp(value, 'gi')
  return (str.match(regExp) || []).length
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
  const out = { code: 'ok', colour: [], guess, score } // output array
  let allGreen = true
  for (let i = 0; i < post.guess.length; i++) {
    const letter = guess.charAt(i)
    const temp = correctWord

    if (letter === correctWord.charAt(i)) {
      out.colour.push('green')
    } else if (correctWord.indexOf(letter) > -1) {
      let valid = true
      const countInWord = countOcurrences(temp, letter)
      const countInGuess = countOcurrences(guess, letter)

      if (countInWord === 1) {
        const prevLettersInGuess = guess.substring(0, i)
        const preOccurCount = countOcurrences(prevLettersInGuess, letter)

        if (preOccurCount > 0) {
          valid = false
        }
      } else
      if (countInGuess > 1 && valid === true) { // is any of the guess duplicate letters right
        const index = guess.indexOf(letter, i + 1)

        if (index === -1) { // no other occurances of the word found
          valid = false
        } else {
          if (guess.charAt(i) === correctWord.charAt(index)) {
            const newWord = correctWord.substr(0, index) + correctWord.substr((index + 1), correctWord.length)
            if (newWord.indexOf(letter) === -1) {
              valid = false
            }
          }
        }
      }
      if (valid === true) { out.colour.push('yellow') } else {
        out.colour.push('gray')
      }

      allGreen = false
    } else {
      out.colour.push('gray')
      allGreen = false
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
  playerGame.score += score

  // // check if game is done
  // if (playerGame.gameMode === 'practice') {
  //   if (allGreen || ((turn + 1) === 6)) {
  //     playerGame.complete = true
  //     playerGame.completedAt = Date.now()
  //     playerGame.markModified('completedAt')
  //   }
  // }

  // report guess if multiplayer
  // if (playerGame.gameMode === 'multiplayer' || true) {
  // check if game is done
  if (allGreen || playerGame.guesses.length === playerGame.players.length * 6) {
    global.events.emit('gameChannel' + playerGame.code, {
      type: 'end',
      guess: {
        player: req.user.username,
        colours: out.colour
      }
    })
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
  // }

  await playerGame.save() // save to database

  res.json(out)
}

module.exports = { colourCodeGuess, revealWord }
