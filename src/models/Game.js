const mongoose = require('mongoose')

// Define schema
const Schema = mongoose.Schema
const GameSchema = new Schema({
  word: { //  a Game has one word
    type: String,
    required: true
  },
  guesses: [{ // a Game has many Guesses
    guess: String, // the Guess that was made
    colours: [String], // the colour scoring of the Guess
    score: Number // the score for the Guess
  }]
})

module.exports = mongoose.model('Game', GameSchema)
