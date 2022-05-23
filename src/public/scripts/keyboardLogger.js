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

    switch (colours[i]) {
      case 'yellow': btn.classList.remove('btn-secondary')
        if (!btn.classList.contains('btn-success')) { btn.classList.add('btn-warning') }
        break
      case 'gray': btn.classList.add('btn-dark')
        btn.classList.remove('btn-secondary')
        break
      case 'green': btn.classList.add('btn-success')
        btn.classList.remove('btn-warning')
        btn.classList.remove('btn-secondary')
        break
    }

    // console.log(btn.classList.value)
  }
}

module.exports = { functionToExecute, removeLetter, updateKeyboardColour }
