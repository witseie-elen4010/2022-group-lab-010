'use strict'

const functionToExecute = function (letter) {
  if (letter.length > 1) {
    letter = letter.substring(0, 1) // Take the first element
  }

  const message = document.getElementById('guess')

  if (message.value.length < 5) {
    message.value += letter
  }

  const event = new window.Event('input')
  message.dispatchEvent(event)

  return letter
}

const removeLetter = function () {
  const message = document.getElementById('guess')
  // console.log('the guess words iss ', message.value)
  message.value = message.value.substring(0, message.value.length - 1)
  const event = new window.Event('input')
  message.dispatchEvent(event)
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
        if (!btn.classList.contains('bg-green')) { btn.classList.add('bg-yellow') }
        break
      case 'gray': btn.classList.add('bg-gray')
        btn.classList.remove('btn-secondary')
        break
      case 'green': btn.classList.add('bg-green')
        btn.classList.remove('bg-yellow')
        btn.classList.remove('btn-secondary')
        break
    }

    // console.log(btn.classList.value)
  }
}

module.exports = { functionToExecute, removeLetter, updateKeyboardColour }
