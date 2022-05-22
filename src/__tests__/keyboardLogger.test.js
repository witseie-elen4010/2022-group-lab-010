'use strict'
/* eslint-env jest */

const jsdom = require('jsdom')
const { JSDOM } = jsdom
const dom = new JSDOM('<!DOCTYPE html><p>Hello world</p>')
global.document = dom.window.document
const keyboard = require('../public/scripts/keyboardLogger')
const express = require('express')
const router = require('../routes/main.routes')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', router)

describe('Test Button component', () => {
  it('Test click event', () => {
    const g = document.createElement('input')
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
    const smallerWord = keyboard.removeLetter()
    console.log(smallerWord.value)
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
    keyboard.updateKeyboardCcolour(mockGuess, colour)

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
    keyboard.updateKeyboardCcolour(mockGuess, colour)

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
    keyboard.updateKeyboardCcolour(mockGuess, colour)

    for (let i = 0; i < colour.length; i++) {
      const letterID = 'button' + mockGuess.charAt(i).toUpperCase()
      const letter = document.getElementById(letterID)
      expect(letter.className).toContain('bg-' + colour[i])
    }
  })
})
