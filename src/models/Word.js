const mongoose = require('mongoose')

// Define dictionary schema
const Schema = mongoose.Schema

const WordSchema = new Schema({
  word: {
    type: String,
    required: true,
    unique: true
  }
})

const Word = mongoose.model('Word', WordSchema)

module.exports = Word
