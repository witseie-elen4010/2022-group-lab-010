'use strict'

const functionToExecute = function (letter) {
  console.log(letter)

  if (letter.length > 1) {
    console.log('error button length is too long ')
    letter = letter.substring(0, 1) // Take the first element
  }

  const message = document.getElementById('guess')

  message.value += letter

  return letter
}

const removeLetter = function () {
  const message = document.getElementById('guess')
  message.value = message.value.substring(0, message.value.length - 1)
}
module.exports = { functionToExecute, removeLetter }

/*
const buttonQ = document.getElementById('buttonQ')
buttonQ.addEventListener('click', function () {
    console.log("q")

}, false)

const buttonW = document.getElementById('buttonW')
buttonW.addEventListener('click', function () {
    console.log("W")

}, false)

const buttonE = document.getElementById('buttonE')
buttonE.addEventListener('click', function () {
    console.log("Y")

}, false)

const buttonR = document.getElementById('buttonR')
buttonR.addEventListener('click', function () {
    console.log("Y")

}, false)

const buttonT = document.getElementById('buttonT')
buttonT.addEventListener('click', function () {
    console.log("Y")

}, false)

const buttonY = document.getElementById('buttonY')
buttonT.addEventListener('click', function () {
    console.log("Y")

}, false) */
