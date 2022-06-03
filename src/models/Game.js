const mongoose = require('mongoose')
const crypto = require('crypto')

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
      },
      playerNumber: Number
    }],
    gameMode: {
      type: String, // a the type of the game either 'practice', 'multiplayer'
      default: 'practice'
    },
    complete: { // has the game finished
      type: Boolean,
      default: false
    },
    completedAt: { // when did the game finish
      type: Date
    },
    score: {
      type: Number,
      default: 0
    },
    code: {
      type: String,
      unique: true
    },
    players: [{
      player: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
      }
    }]

  },
  { timestamps: true } // createdAt and updatedAt
)

GameSchema.methods.generateCode = async function () {
  const game = this

  let code = ''

  do {
    code = crypto.randomBytes(24).toString('hex')
  }
  while (await mongoose.model('Game').exists({ code }))

  game.code = code
  const valid = await game.save()

  if (valid) return code
  return false
}

module.exports = mongoose.model('Game', GameSchema)
