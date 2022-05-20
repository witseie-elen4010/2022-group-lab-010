'use strict'
/* eslint-env jest */

const jsdom = require('jsdom')
const { JSDOM } = jsdom
const dom = new JSDOM('<!DOCTYPE html><p>Hello world</p>')
// console.log(dom.window.document.querySelector('p').textContent) // "Hello world"
global.document = dom.window.document

const keyboard = require('../public/scripts/keyboardLogger')

const game = require('../controllers/game.controllers')
// import * as guesses from '../controllers/guesses.controllers'
const request = require('supertest')
const express = require('express')
const router = require('../routes/main.routes')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', router)

// mocking the correct word
const correctWordSpy = jest.spyOn(game, 'getCorrectWord')
correctWordSpy.mockImplementation(() => 'SMART')

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
    keyboard.removeLetter()
    expect(g.value).toBe('a')
  })
  it('Test keyboard colour updates', async () => {
    const res = await request(app)
      .post('/api/guess')
      .send({ guess: 'MOUSE' })
      .expect(200)
      .expect('Content-Type', /json/)
    const colour = res.body.colour
    expect(colour.length).toBe(5)
    expect(colour).toStrictEqual(['yellow', 'gray', 'gray', 'yellow', 'gray'])
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
    const res = await request(app)
      .post('/api/guess')
      .send({ guess: mockGuess })
      .expect(200) // bad request, not a word
      .expect('Content-Type', /json/)
    const colour = res.body.colour
    // console.log('logging res:', res.body.colour)
    expect(colour.length).toBe(5)
    expect(colour).toStrictEqual(['green', 'green', 'green', 'green', 'green'])
    // const mockGuess = 'MOUSE'

    for (let i = 0; i < colour.length; i++) {
      const letterID = 'button' + mockGuess.charAt(i).toUpperCase()
      const btn = document.createElement('btn')
      btn.id = letterID
      document.body.appendChild(btn)
    //  btn.classList.add('bg-' + colour[i])
    }
    keyboard.updateKeyboardColour(mockGuess, colour)

    for (let i = 0; i < colour.length; i++) {
      const letterID = 'button' + mockGuess.charAt(i).toUpperCase()
      const letter = document.getElementById(letterID)
      expect(letter.className).toContain('bg-' + colour[i])
    }

    // expect('a').toBe('a')
  })

  it('Test keyboard colour updates of correct word', async () => {
    const mockGuess = 'EBONY' // must be a vaid word
    const res = await request(app)
      .post('/api/guess')
      .send({ guess: mockGuess })
      .expect(200) // bad request, not a word
      .expect('Content-Type', /json/)
    const colour = res.body.colour
    // console.log('logging res:', res.body.colour)
    expect(colour.length).toBe(5)
    expect(colour).toStrictEqual(['gray', 'gray', 'gray', 'gray', 'gray'])
    // const mockGuess = 'MOUSE'

    for (let i = 0; i < colour.length; i++) {
      const letterID = 'button' + mockGuess.charAt(i).toUpperCase()
      const btn = document.createElement('btn')
      btn.id = letterID
      document.body.appendChild(btn)
    //  btn.classList.add('bg-' + colour[i])
    }
    keyboard.updateKeyboardColour(mockGuess, colour)

    for (let i = 0; i < colour.length; i++) {
      const letterID = 'button' + mockGuess.charAt(i).toUpperCase()
      const letter = document.getElementById(letterID)
      expect(letter.className).toContain('bg-' + colour[i])
    }

  //  expect('a').toBe('a')
  })
})
