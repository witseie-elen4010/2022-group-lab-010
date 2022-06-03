'use strict'

/* eslint-env jest */

const Game = require('../models/Game')
const Word = require('../models/Word')
// import * as guesses from '../controllers/guesses.controllers'
const request = require('supertest')
const express = require('express')
const router = require('../routes/main.routes')
const bodyParser = require('body-parser')
const db = require('../models/dbTest')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', router)

let mockedGame
jest.setTimeout(15000)
beforeAll(async () => {
  await db.connect()
  await db.seed()
  const mockedWord = await Word.findOne({ word: 'mouse' }).exec() // force game word to be 'MOUSE'
  mockedGame = await Game.create({ word: mockedWord._id, guesses: [], gameMode: 'practice' })
})

afterAll(async () => {
  db.close()
})

describe('Test Game Controller', function () {
  it('tests /api/game - Creates a usable game code', async () => {
    const res = await request(app)
      .get('/api/game')
      .expect(200)

    await request(app)
      .post('/api/guess')
      .send({ game: res.body.game, guess: 'MOUSE' })
      .expect(200)
  })

  it('tests /api/game/log endpoint - Invalid game', async () => {
    await request(app)
      .post('/api/game/log')
      .send({ game: 'An invalid game' })
      .expect(400)
  })

  it('tests /api/game/log endpoint - Game not ended', async () => {
    await request(app)
      .post('/api/game/log')
      .send({ game: mockedGame._id })
      .expect(400)
  })

  it('tests /api/game/log endpoint - Valid game', async () => {
    await request(app)
      .post('/api/guess')
      .send({ guess: 'SMART', game: mockedGame._id })
      .expect(200)

    await request(app)
      .post('/api/guess')
      .send({ guess: 'PIZZA', game: mockedGame._id })
      .expect(200)

    await request(app)
      .post('/api/guess')
      .send({ guess: 'MOUSE', game: mockedGame._id })
      .expect(200)

    const res = await request(app)
      .post('/api/game/log')
      .send({ game: mockedGame._id })
      .expect(200)

    const smartColours = ['yellow', 'yellow', 'gray', 'gray', 'gray']
    const pizzaColours = ['gray', 'gray', 'gray', 'gray', 'gray']
    const mouseColours = ['green', 'green', 'green', 'green', 'green']

    const log = res.body.log
    expect(log.correctWord).toBe('MOUSE')

    const start = new Date(log.start)
    const end = new Date(log.end)
    expect(end.getTime() - start.getTime()).toBeGreaterThanOrEqual(0)
    expect(log.guesses.length).toBe(3)

    const smartGuess = log.guesses[0]
    const pizzaGuess = log.guesses[1]
    const mouseGuess = log.guesses[2]

    expect(smartGuess.guess).toBe('SMART')
    expect(smartGuess.colours).toStrictEqual(smartColours)
    expect(smartGuess.score).toBe(72)

    expect(pizzaGuess.guess).toBe('PIZZA')
    expect(pizzaGuess.colours).toStrictEqual(pizzaColours)
    expect(pizzaGuess.score).toBe(0)

    expect(mouseGuess.guess).toBe('MOUSE')
    expect(mouseGuess.colours).toStrictEqual(mouseColours)
    expect(mouseGuess.score).toBe(320)

    expect(log.score).toBe(392)
  })
})
