'use strict'

/* eslint-env jest */

const Game = require('../models/Game')
const Word = require('../models/Word')
// import * as guesses from '../controllers/guesses.controllers'
const request = require('supertest')
const express = require('express')
const router = require('../routes/main.routes')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const db = require('../models/dbTest')
const User = require('../models/User')
const app = express()
app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', router)

let mockedGame

/*

Scoring algorithm:

multiplier <-- (6 - previous Guesses made) ^ 2

score <-- multiplier * (4 * number of greens + number of yellows)

*/
jest.setTimeout(30000)
beforeAll(async () => {
  await db.connect()
  await db.seed()
  const mockedWord = await Word.findOne({ word: 'mouse' }).exec() // force game word to be 'MOUSE'
  const mockUser = await User.findOne({ username: 'TestUser' }).exec() // force user to be 'TestUser'
  mockedGame = await Game.create({ word: mockedWord._id, guesses: [], gameMode: 'practice', players: [{ player: mockUser._id }], code: 'mockCode' })
})

afterAll(async () => {
  db.close()
})

describe('Test Guesses Controller', function () {
  // guess 1/6
  it('tests /api/guess endpoint - First letter wrong', async () => {
    const res = await request(app)
      .post('/api/guess')
      .send({ guess: 'HOUSE', game: mockedGame.code, username: 'TestUser' })
      .expect(200)
      .expect('Content-Type', /json/)

    const colours = ['gray', 'green', 'green', 'green', 'green']
    const colour = res.body.colour
    const score = res.body.score
    expect(colour.length).toBe(5)
    expect(colour).toStrictEqual(colours)
    expect(score).toBe(576)
  })

  it('tests /api/correct - Should not reveal word until game is done', async () => {
    await request(app)
      .post('/api/correct')
      .send({ game: mockedGame.code, username: 'TestUser' })
      .expect(400)
  })

  it('tests /api/correct - Invalid game', async () => {
    await request(app)
      .post('/api/correct')
      .send({ game: 'an invalid game', username: 'TestUser' })
      .expect(400)
  })

  // guess 2/6
  it('tests /api/guess endpoint - Most letters wrong', async () => {
    const res = await request(app)
      .post('/api/guess')
      .send({ guess: 'SMART', game: mockedGame.code, username: 'TestUser' })
      .expect(200)
      .expect('Content-Type', /json/)

    const colours = ['yellow', 'yellow', 'gray', 'gray', 'gray']
    const colour = res.body.colour
    const score = res.body.score
    expect(colour.length).toBe(5)
    expect(colour).toStrictEqual(colours)
    expect(score).toBe(50)
  })

  // guess 3/6
  it('tests /api/guess endpoint - All letters wrong', async () => {
    const res = await request(app)
      .post('/api/guess')
      .send({ guess: 'PIZZA', game: mockedGame.code, username: 'TestUser' })
      .expect(200)
      .expect('Content-Type', /json/)

    const colours = ['gray', 'gray', 'gray', 'gray', 'gray']
    const score = res.body.score
    const colour = res.body.colour
    expect(colour.length).toBe(5)
    expect(colour).toStrictEqual(colours)
    expect(score).toBe(0)
  })

  // guess not recorded
  it('tests /api/guess endpoint - Too Long Word', async () => {
    const res = await request(app)
      .post('/api/guess')
      .send({ guess: 'MOUSES', game: mockedGame.code, username: 'TestUser' })
      .expect(400)
      .expect('Content-Type', /json/)
    expect(res.body.code).toBe('error')
  })

  // guess not recorded
  it('tests /api/guess endpoint - Too Short Word', async () => {
    const res = await request(app)
      .post('/api/guess')
      .send({ guess: 'MICE', game: mockedGame.code, username: 'TestUser' })
      .expect(400)
      .expect('Content-Type', /json/)
    expect(res.body.code).toBe('error')
  })

  it('tests /api/guess endpoint - Invalid word', async () => {
    const res = await request(app)
      .post('/api/guess')
      .send({ guess: 'ASDFS', game: mockedGame.code, username: 'TestUser' })
      .expect(400)
      .expect('Content-Type', /json/)
    expect(res.body.code).toBe('error')
  })

  // guess 4/6
  it('tests /api/guess endpoint - Correct word', async () => {
    const res = await request(app)
      .post('/api/guess')
      .send({ guess: 'MOUSE', game: mockedGame.code, username: 'TestUser' })
      .expect(200)
      .expect('Content-Type', /json/)

    const colours = ['green', 'green', 'green', 'green', 'green']
    const colour = res.body.colour
    const score = res.body.score
    expect(colour.length).toBe(5)
    expect(colour).toStrictEqual(colours)
    expect(score).toBe(180)
  })

  it('tests /api/correct - Reveals correct word', async () => {
    const res = await request(app)
      .post('/api/correct')
      .send({ game: mockedGame.code, username: 'TestUser' })
      .expect(200)

    const word = res.body.word
    expect(word).toBe('MOUSE')
  })
})
