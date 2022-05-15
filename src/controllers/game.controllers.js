'use strict'
const fs = require('fs')
const path = require('path')

// Generate random number with seed
const xmur3 = (str) => {
  let number = 0
  const length = str.length
  for (let i = 0; i < length; i++) {
    number += str.charCodeAt(i)
  }
  let seed = number
  for (let i = 0; i < 1000; i++) {
    seed = seed * 16807 % 2147483647
  }
  return seed / 2147483647
}

const getCorrectWord = () => {
  const date = new Date().toISOString().split('T')[0]

  const file = fs.readFileSync(path.join(__dirname, '..', 'models', 'dictionary.json'))
  const dict = JSON.parse(file)
  const len = dict.length

  const index = parseInt(xmur3(date) * len)
  const word = dict[index]
  console.log(word)
  return word.toUpperCase()
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
