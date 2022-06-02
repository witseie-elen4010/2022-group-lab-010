'use strict'
/* global alert */
document.getElementById('timer').innerHTML =
    9 + ':' + 15
let pause = false
startTimer()

function startTimer () {
  if (pause === false) {
    const presentTime = document.getElementById('timer').innerHTML
    const timeArray = presentTime.split(/[:]+/)
    let m = Number(timeArray[0])
    const s = checkSecond((timeArray[1] - 1))
    if (s === '59') {
      m = m - 1
    }
    if (m < 0) {
      return
    }

    document.getElementById('timer').innerHTML =
            m + ':' + s

    if (s === 10) {
      console.log(typeof (s))
    }

    setTimeout(startTimer, 1000)

    if (m === 9 && s === 10) {
      /* const fetch = require('node-fetch')
      global.fetch = fetch
      global.Headers = fetch.Headers */
      console.log('times up')
      const x = document.getElementById('Game Result')
      x.innerHTML = 'Times up ! Please try again.  ' //   $('#staticBackdrop').modal('show') // The correct word was ${data}` // Dont show the correct word when you run out of time

      // const headers
      /* const raw = JSON.stringify({
        game: game
      })
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: raw,
        redirect: 'follow'
      }
      fetch('api/correct', requestOptions)
        .then(function (response) {
          if (response.ok) {
            return response.json()// Return the response parse as JSON
          } else { throw new Error('Failed to load correct word: response code invalid!') }
        })
        .then(function (data) {
          console.log(data)
          const x = document.getElementById('Game Result')
          x.innerHTML = ' You ran out of time. Please try again. If you give up, Hover your curser below me to see the word ' // The correct word was ${data}` // Dont show the correct word when you run out of time

          const out = document.createElement('div')
          out.style = 'border:  width: 220px; font-family: sans-serif'

          const inner = document.createElement('div')
          inner.style = 'height: 20px; width: 220px;;' // background-color: cyan;'
          inner.id = 'mouse_over'
          inner.innerText = `The correct word was ${data}`
          out.appendChild(inner)
          x.appendChild(out)
        })
        .catch(function (e) { // Process error for request
          alert(e) // Displays a browser alert with the error message.
        }) */

      /*  const y = document.getElementById('submit Guess')
      y.setAttribute('class', 'btn btn-primary')
      y.setAttribute('data-bs-toggle', 'modal')
      y.setAttribute('data-bs-target', '#staticBackdrop')
      y.innerHTML = 'complete'
      y.click() */

      // document.body.appendChild(btn);
    }
  }
  /*  console.log(pause) */
}

function checkSecond (sec) {
  if (sec < 10 && sec >= 0) { sec = '0' + sec }; // add zero in front of numbers < 10
  if (sec < 0) { sec = '59' };
  return sec
}
const pauseTimer = function () {
  if (pause === false) {
    pause = true
    document.getElementById('pauseTimer').classList.remove('btn-light')
    document.getElementById('pauseTimer').classList.add('btn-dark')
    document.getElementById('clockIcon').classList.remove('bi-clock')
    document.getElementById('clockIcon').classList.add('bi-clock-history')
  } else {
    pause = false
    document.getElementById('pauseTimer').classList.remove('btn-dark')
    document.getElementById('pauseTimer').classList.add('btn-light')
    document.getElementById('clockIcon').classList.remove('bi-clock-history')
    document.getElementById('clockIcon').classList.add('bi-clock')
  }
  // console.log(pause)
  startTimer()
}

const el = document.getElementById('revealWord')
if (el) {
  console.log('show word')
  el.addEventListener('click', revWord, false)
}
function revWord (data) {
  // console.log('show word')
  const x = document.getElementById('Game Result')
  x.innerHTML = ' You ran out of time. Please try again.' //  The correct word was ${data}` // Dont show the correct word when you run out of time

  const out = document.createElement('div')
  out.classList.add('myDIV')
  const block = document.createElement('div')
  // console.log(out)
  const showw = document.createElement('h1')
  showw.innerHTML = 'Hover over me to see the word'
  out.appendChild(showw)

  block.classList.add('myDIV', 'hide')
  const letter = document.createElement('h1')
  letter.classList.add('myDIV', 'hide')
  letter.innerHTML = `The correct word was ${data}`
  block.appendChild(letter)
  out.appendChild(block)
  x.appendChild(out)
}

if (typeof module !== 'undefined') module.exports = { pauseTimer }
