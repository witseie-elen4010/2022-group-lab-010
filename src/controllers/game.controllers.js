'use strict'
const fs = require('fs')
const path = require('path')

const getCorrectWord = () => {
  // For now the only correct word is SMART
  return 'SMART'
}

const wordIsValid = (word) => {
  word = word.toLowerCase()
  if (word.length !== 5) return false

  const file = fs.readFileSync(path.join(__dirname, '..', 'models', 'dictionary.json'))
  const dict = JSON.parse(file)
  if (dict.indexOf(word) > -1) return true
}

module.exports = {
  getCorrectWord,
  wordIsValid
}
