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
  if (!post) {
    res.status(400).send({
      message: 'Invalid Request Body',
      code: 'error'
    })
    res.end()
    return
  }

  let playerGame

  if (!post.game || !(playerGame = await game.getGame(req.user, post.game))) {
    res.status(400).send({
      message: 'Error: Invalid Game',
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
  console.log('The guess made is: ', post.guess, ' correct word: ', correctWord)
  let allGreen = true
  for (let i = 0; i < post.guess.length; i++) {
    const letter = guess.charAt(i)
    const temp = correctWord

    console.log('guess position ', i)

    /* const re = new RegExp(letter, 'g')
    const count = countOcurrences(temp, letter)
    console.log('The letter ', letter, 'appears in the word : ', count)

    const countGuess = countOcurrences(guess, letter)
    console.log('The letter ', letter, 'appears in the guess: ', countGuess)

    const prevLetters = correctWord.substring(0, i)
    console.log('The previous letters are ', prevLetters)
    const preOccurCount = countOcurrences(prevLetters, letter)
    console.log('The letter ', letter, 'appeared before: ', preOccurCount)
    console.log(' ') */

    // Score each letter
    /* if (countGuess > count && (preOccurCount > 0 || i === 0)) {
      out.colour.push('gray')
      allGreen = false
    } else */

    if (letter === correctWord.charAt(i)) {
      out.colour.push('green')
    } else if (correctWord.indexOf(letter) > -1) {
      let valid = true
      console.log('guess position ', i)
      const countInWord = countOcurrences(temp, letter)
      console.log('The letter ', letter, 'appears in the word : ', countInWord)
      const countInGuess = countOcurrences(guess, letter)
      console.log('The letter ', letter, 'appears in the guess: ', countInGuess)

      if (countInWord === 1) {
        // check if this is the first duplicate letter

        const prevLettersInGuess = guess.substring(0, i)
        console.log('The previous letters are ', prevLettersInGuess)
        const preOccurCount = countOcurrences(prevLettersInGuess, letter)
        console.log('The letter ', letter, 'appeared before: ', preOccurCount)

        if (preOccurCount > 0) {
          valid = false
        }
      } else
      if (countInGuess > 1 && valid === true) { // is any of the guess duplicate letters right
        /* const futureGuessLetters = correctWord.substring(0, i + 1) */
        const index = guess.indexOf(letter, i + 1)

        if (index === -1) { // no other occurances of the word found
          /*  out.colour.push('yellow') */
          valid = false
        } else {
          if (guess.charAt(i) === correctWord.charAt(index)) {
            const newWord = correctWord.substr(0, index) + correctWord.substr((index + 1), correctWord.length)
            console.log('new word is ', newWord)
            const newGuess = guess.substr(0, i) + guess.substr((i + 1), guess.length)
            console.log('new word is ', newGuess)

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
