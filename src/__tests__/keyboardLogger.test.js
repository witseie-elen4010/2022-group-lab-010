'use strict'
/* eslint-env jest */
/**
 * @jest-environment jsdom
 */

const jsdom = require('jsdom')
const { JSDOM } = jsdom
const dom = new JSDOM('<!DOCTYPE html><p>Hello world</p>')
global.window = dom.window
global.document = window.document
const keyboard = require('../public/scripts/keyboardLogger')

describe('Test Button component', () => {
  it('Test click event', () => {
    const g = document.createElement('button')
    g.id = 'guess'

    document.body.appendChild(g)

    expect(keyboard.functionToExecute('a')).toBe('a')
  })

  it('Test click event', () => {
    const g = document.createElement('input')
    g.id = 'guess'

    document.body.appendChild(g)

    expect(keyboard.functionToExecute('ba')).toBe('b')
  })

  it('Test click event', () => {
    const g = document.getElementById('guess')
    keyboard.removeLetter()
    expect(g.value).toBe('a')
  })
  it('Test keyboard colour updates', async () => {
    const colour = ['yellow', 'gray', 'gray', 'yellow', 'gray']
    const mockGuess = 'MOUSE'

    for (let i = 0; i < colour.length; i++) {
      const letterID = 'button' + mockGuess.charAt(i).toUpperCase()
      const btn = document.createElement('btn')
      btn.id = letterID
      document.body.appendChild(btn)
    }
    keyboard.updateKeyboardColour(mockGuess, colour)

    for (let i = 0; i < colour.length; i++) {
      const letterID = 'button' + mockGuess.charAt(i).toUpperCase()
      const letter = document.getElementById(letterID)
      expect(letter.className).toContain('bg-' + colour[i])
    }
  })
  it('Test keyboard colour updates of correct word', async () => {
    const mockGuess = 'SMART' // must be a vaid word
    const colour = ['green', 'green', 'green', 'green', 'green']

    for (let i = 0; i < colour.length; i++) {
      const letterID = 'button' + mockGuess.charAt(i).toUpperCase()
      const btn = document.createElement('btn')
      btn.id = letterID
      document.body.appendChild(btn)
    }
    keyboard.updateKeyboardColour(mockGuess, colour)

    for (let i = 0; i < colour.length; i++) {
      const letterID = 'button' + mockGuess.charAt(i).toUpperCase()
      const letter = document.getElementById(letterID)
      expect(letter.className).toContain('bg-' + colour[i])
    }
  })

  it('Test keyboard colour updates of correct word', async () => {
    const mockGuess = 'EBONY' // must be a vaid word
    const colour = ['gray', 'gray', 'gray', 'gray', 'gray']

    for (let i = 0; i < colour.length; i++) {
      const letterID = 'button' + mockGuess.charAt(i).toUpperCase()
      const btn = document.createElement('btn')
      btn.id = letterID
      document.body.appendChild(btn)
    }
    keyboard.updateKeyboardColour(mockGuess, colour)

    for (let i = 0; i < colour.length; i++) {
      const letterID = 'button' + mockGuess.charAt(i).toUpperCase()
      const letter = document.getElementById(letterID)
      expect(letter.className).toContain('bg-' + colour[i])
    }
  })
  it('Test keyboard colour updates of correct word', async () => {
    const mockGuess = 'BEECH' // must be a vaid word
    const colour = ['yellow', 'yellow', 'gray', 'gray', 'gray']

    for (let i = 0; i < colour.length; i++) {
      const letterID = 'button' + mockGuess.charAt(i).toUpperCase()
      const btn = document.createElement('btn')
      btn.id = letterID
      document.body.appendChild(btn)
    }
    keyboard.updateKeyboardColour(mockGuess, colour)

    for (let i = 0; i < colour.length; i++) {
      const letterID = 'button' + mockGuess.charAt(i).toUpperCase()
      const letter = document.getElementById(letterID)

      if (i === 2) {
        expect(letter.className).toContain('bg-' + 'yellow') // both letters must be yellow, not gray
      } else { expect(letter.className).toContain('bg-' + colour[i]) }
    }
  })
})
