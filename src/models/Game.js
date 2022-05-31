const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const crypto = require('crypto')

const saltRounds = 10

// Define schema
const Schema = mongoose.Schema
const GameSchema = new Schema(
  {
    word: { //  a Game has one word
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Word'
    },
    guesses: [{ // a Game has many Guesses
      guess: String, // the Guess that was made
      colours: [String], // the colour scoring of the Guess
      score: Number, // the score for the Guess
      date: { // the timestamp when the guess was made
        type: Date,
        default: Date.now
      }
    }],
    gameMode: {
      type: String, // a the type of the game either 'practice', 'multiplayer'
      default: 'practice'
    },
    complete: {
      type: Boolean,
      default: false
    }
    // owner: {
    //   type: mongoose.Types.ObjectId,
    //   required: true,
    //   ref: 'Player'
    // }

  },
  { timestamps: true } // createdAt and updatedAt
)

GameSchema.method.generateCode = function (callback) {
  const game = this
  const code = crypto.randomBytes(64).toString('hex')
  game.code = bcrypt.hashSync(saltRounds, code)
  game.save((err, game) => {
    if (err) return callback(err)
    callback(null, code)
  })
  return code
}

module.exports = mongoose.model('Game', GameSchema)
