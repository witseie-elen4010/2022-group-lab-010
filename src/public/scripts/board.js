const initBoards = function (count) {
  for (let i = 0; i < count; i++) {
    const board = document.createElement('div')
    board.classList.add('col-xl', 'pb-2')
    board.id = 'board' + i
    for (let row = 0; row < 6; row++) {
      const line = document.createElement('div')
      line.classList.add(['pb-1'])
      for (let character = 0; character < 5; character++) {
        const block = document.createElement('div')
        block.classList.add('card', 'card-body', 'letter-block', 'm-1')
        const letter = document.createElement('h1')
        letter.id = 'row' + row + 'character' + character
        block.id = 'blockrow' + row + 'character' + character
        const letterContainer = document.createElement('div')
        letterContainer.classList.add('d-inline-flex', 'h-100', 'w-100', 'align-items-center', 'justify-content-center')
        letterContainer.appendChild(letter)
        block.appendChild(letterContainer)
        line.appendChild(block)
      }
      board.appendChild(line)
    }
    document.getElementById('boards').appendChild(board)
  }
}

const syncRowToInput = function (guess, guessCount) {
  if (guess.length > 5) {
    guess = guess.substring(0, 5)
    document.getElementById('guess').value = guess
  }
  for (let character = 0; character < guess.length; character++) {
    document.getElementById('row' + guessCount + 'character' + character).innerHTML = guess.charAt(character).toUpperCase()
  }
  for (let character = guess.length; character < 5; character++) {
    document.getElementById('row' + guessCount + 'character' + character).innerHTML = ''
  }
}

const colorBoardToGuess = (guess, colours, guessCount) => {
  const out = document.createElement('div')
  out.classList.add(['pb-1'])

  guess = guess.toUpperCase()

  for (let character = 0; character < colours.length; character++) {
    document.getElementById('blockrow' + guessCount + 'character' + character).classList.add('bg-' + colours[character], 'm-1')
    document.getElementById('row' + guessCount + 'character' + character).innerHTML = guess.charAt(character)
  }

  document.getElementById('guess').value = ''
}

module.exports = { initBoards, syncRowToInput, colorBoardToGuess }
