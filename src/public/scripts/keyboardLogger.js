'use strict'

const functionToExecute = function (letter) {
//  console.log(letter)

  if (letter.length > 1) {
    // console.log('error button length is too long ')
    letter = letter.substring(0, 1) // Take the first element
  }

  const message = document.getElementById('guess')

  message.value += letter

  return letter
}

const removeLetter = function () {
  const message = document.getElementById('guess')
  // console.log('the guess words iss ', message.value)
  message.value = message.value.substring(0, message.value.length - 1)
  return message
}

const updateKeyboardColour = function (guess, colours) {
  for (let i = 0; i < 5; i++) {
    const letterID = 'button' + guess.charAt(i).toUpperCase()
    // console.log('after getting letter ID : ', letterID)
    const btn = document.getElementById(letterID)
    // console.log('BEFORE', btn.classList.value)
    if (btn.classList.length === 1) {
      // console.log(btn.classList)
    }

    // btn.classList.add('bg-' + colours[i])
    // console.log('AFTER class list ', btn.classList.value)

    if (btn.classList.value === 'btn bg-green') {
      // console.log(btn.classList.value)
    } else {
      btn.classList.value = 'btn ' + 'bg-' + colours[i]
    }

    // console.log(btn.classList.value)
  }
}

module.exports = { functionToExecute, removeLetter, updateKeyboardColour }
