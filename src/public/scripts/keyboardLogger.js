'use strict'

const functionToExecute = function (letter) {
//  console.log(letter)

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
  console.log('the guess words iss ', message.value)
  message.value = message.value.substring(0, message.value.length - 1)
  return message
}

const updateKeyboardCcolour = function (guess, colours) {
  // console.log('data,color is as follows: ', colours)
  // console.log('the guess is as follows: ', guess)
  for (let i = 0; i < colours.length; i++) {
    const letterID = 'button' + guess.charAt(i).toUpperCase()
    const btn = document.getElementById(letterID)
    btn.classList.add('bg-' + colours[i])
  }
}

module.exports = { functionToExecute, removeLetter, updateKeyboardCcolour }
