'use strict'

/* eslint-env jest */

const Game = require('../models/Game')
const Word = require('../models/Word')
const User = require('../models/User')
// import * as guesses from '../controllers/guesses.controllers'
const request = require('supertest')
const express = require('express')
const router = require('../routes/main.routes')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const db = require('../models/dbTest')
const app = express()
const EventEmitter = require('events')
app.use(bodyParser.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', router)

global.events = new EventEmitter()

let mockedGame
let mockedMultiplayerGame
jest.setTimeout(15000)
beforeAll(async () => {
  await db.connect()
  await db.seed()
  const mockedWord = await Word.findOne({ word: 'mouse' }).exec() // force game word to be 'MOUSE'
  const mockUser = await User.findOne({ username: 'TestUser' }).exec() // force user to be 'TestUser'
  mockedGame = await Game.create({ word: mockedWord._id, guesses: [], gameMode: 'practice', players: [{ player: mockUser._id }], code: 'mockCode' })
  mockedMultiplayerGame = await Game.create({ word: mockedWord._id, guesses: [], gameMode: 'multiplayer', players: [{ player: mockUser._id }], code: 'multiplayerCode' })
})

afterAll(async () => {
  db.close()
})

describe('Test Game Controller', function () {
  it('tests /game - invalid game code', async () => {
    await request(app)
      .get('/game')
      .set('Cookie', ['username=TestUser', 'token=1234'])
      .expect(302)
  })

  it('tests /game - invalid game code api call', async () => {
    await request(app)
      .get('/game')
      .set('Accept', 'application/json')
      .set('Cookie', ['username=TestUser', 'token=1234'])
      .expect(400)
  })

  it('tests /game - valid game code', async () => {
    await request(app)
      .get('/game')
      .set('Cookie', ['username=TestUser', 'token=1234'])
      .query({ code: mockedGame.code })
      .expect(200)
  })

  it('tests /game - valid game code, wrong user', async () => {
    await request(app)
      .get('/game')
      .set('Cookie', ['username=TestUser2', 'token=1234'])
      .query({ code: mockedGame.code })
      .expect(302)
  })

  it('tests /api/game - Creates a usable game code', async () => {
    const res = await request(app)
      .get('/api/game')
      .set('Accept', 'application/json')
      .set('Cookie', ['username=TestUser', 'token=1234'])
      .expect(200)

    await request(app)
      .post('/api/guess')
      .send({ game: res.body.game, guess: 'MOUSE', username: 'TestUser', token: '1234' })
      .expect(200)
  })

  it('tests /api/game/log endpoint - Invalid body', async () => {
    await request(app)
      .post('/api/game/log')
      .set('Accept', 'application/json')
      .set('Cookie', ['username=TestUser', 'token=1234'])
      .expect(400)
  })

  it('tests /api/game/log endpoint - Invalid game', async () => {
    await request(app)
      .post('/api/game/log')
      .send({ game: 'An invalid game', username: 'TestUser', token: '1234' })
      .expect(400)
  })

  it('tests /api/game/log endpoint - Game not ended', async () => {
    await request(app)
      .post('/api/game/log')
      .send({ game: mockedGame.code, username: 'TestUser', token: '1234' })
      .expect(400)
  })

  it('tests /api/game/log endpoint - Valid game', async () => {
    await request(app)
      .post('/api/guess')
      .send({ guess: 'SMART', game: mockedGame.code, username: 'TestUser', token: '1234' })
      .expect(200)

    await request(app)
      .post('/api/guess')
      .send({ guess: 'PIZZA', game: mockedGame.code, username: 'TestUser', token: '1234' })
      .expect(200)

    await request(app)
      .post('/api/guess')
      .send({ guess: 'MOUSE', game: mockedGame.code, username: 'TestUser', token: '1234' })
      .expect(200)

    const res = await request(app)
      .post('/api/game/log')
      .send({ game: mockedGame.code, username: 'TestUser', token: '1234' })
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

describe('Testing Multiplayer', function () {
  it('tests /api/multiplayer endpoint - creates a game', async () => {
    const res = await request(app)
      .get('/api/multiplayer')
      .set('Accept', 'application/json')
      .set('Cookie', ['username=TestUser', 'token=1234'])
      .expect(200)

    expect(res.body.game.length).toBeGreaterThanOrEqual(1)
  })

  it('tests /api/guess endpoint - multiplayer game has not started', async () => {
    await request(app)
      .post('/api/guess')
      .set('Accept', 'application/json')
      .send({ guess: 'PIZZA', game: mockedMultiplayerGame.code, username: 'TestUser', token: '1234' })
      .expect('Content-Type', /json/)
      .expect(400)
  })

  it('tests /api/guess endpoint - multiplayer game has not started', async () => {
    await request(app)
      .post('/api/guess')
      .set('Accept', 'application/json')
      .send({ guess: 'PIZZA', game: mockedMultiplayerGame.code, username: 'TestUser', token: '1234' })
      .expect('Content-Type', /json/)
      .expect(400)
  })

  it('tests /api/multiplayer/join endpoint - invalid code', async () => {
    await request(app)
      .post('/api/multiplayer/join')
      .set('Accept', 'application/json')
      .send({ game: 'random code', username: 'TestUser2', token: '1234' })
      .expect('Content-Type', /json/)
      .expect(400)
  })

  it('tests /api/multiplayer/join endpoint - valid code', async () => {
    const lobby = request(app)
      .post('/api/multiplayer/lobby')
      .set('Accept', 'application/json')
      .send({ game: mockedMultiplayerGame.code, username: 'TestUser', token: '1234' })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((req) => {
        expect(req.body.status).toBe('change')
      })
    await new Promise(resolve => setTimeout(resolve, 300))
    await request(app)
      .post('/api/multiplayer/join')
      .set('Accept', 'application/json')
      .send({ game: 'multiplayerCode', username: 'TestUser2', token: '1234' })
      .expect('Content-Type', /json/)
      .expect(200)

    await lobby
  })

  it('tests /api/multiplayer/join endpoint - all ready in game', async () => {
    await request(app)
      .post('/api/multiplayer/join')
      .set('Accept', 'application/json')
      .send({ game: mockedMultiplayerGame.code, username: 'TestUser2', token: '1234' })
      .expect('Content-Type', /json/)
      .expect(400)
  })

  it('tests /api/multiplayer/start endpoint - invalid game', async () => {
    await request(app)
      .post('/api/multiplayer/start')
      .set('Accept', 'application/json')
      .send({ game: 'invalid game code', username: 'TestUser', token: '1234' })
      .expect('Content-Type', /json/)
      .expect(400)
  })

  it('tests /api/multiplayer/start endpoint - not the owner of the game', async () => {
    await request(app)
      .post('/api/multiplayer/start')
      .set('Accept', 'application/json')
      .send({ game: mockedMultiplayerGame.code, username: 'TestUser2', token: '1234' })
      .expect('Content-Type', /json/)
      .expect(400)
  })

  it('tests /api/multiplayer/start endpoint', async () => {
    const lobby = request(app)
      .post('/api/multiplayer/lobby')
      .set('Accept', 'application/json')
      .send({ game: mockedMultiplayerGame.code, username: 'TestUser2', token: '1234' })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((req) => {
        expect(req.body.status).toBe('begin')
      })
    await new Promise(resolve => setTimeout(resolve, 300))
    await request(app)
      .post('/api/multiplayer/start')
      .set('Accept', 'application/json')
      .send({ game: 'multiplayerCode', username: 'TestUser', token: '1234' })
      .expect('Content-Type', /json/)
      .expect(200)

    await lobby
  })

  it('tests /api/multiplayer/lobby endpoint - invalid game', async () => {
    await request(app)
      .post('/api/multiplayer/lobby')
      .set('Accept', 'application/json')
      .send({ game: 'invalid code', username: 'TestUser2', token: '1234' })
      .expect('Content-Type', /json/)
      .expect(400)
  })

  it('tests /api/multiplayer/lobby endpoint - hash fails (provides update)', async () => {
    const res = await request(app)
      .post('/api/multiplayer/lobby')
      .set('Accept', 'application/json')
      .send({ game: mockedMultiplayerGame.code, username: 'TestUser2', token: '1234', hash: 'failing hash' })
      .expect('Content-Type', /json/)
      .expect(200)

    expect(res.body.status).toBe('update')
  })

  it('tests /api/game/channel - invalid game', async () => {
    await request(app)
      .post('/api/game/channel')
      .set('Accept', 'application/json')
      .send({ game: 'invalid code', username: 'TestUser2', token: '1234' })
      .expect('Content-Type', /json/)
      .expect(400)
  })

  it('tests /api/game/channel - other player makes a guess', async () => {
    const lobby = request(app)
      .post('/api/game/channel')
      .set('Accept', 'application/json')
      .send({ game: mockedMultiplayerGame.code, username: 'TestUser2', token: '1234' })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((req) => {
        const body = req.body
        expect(body.status).toBe('change')
        expect(body.guess).toStrictEqual({ player: 'TestUser', colours: ['gray', 'gray', 'gray', 'gray', 'gray'] })
      })
    await new Promise(resolve => setTimeout(resolve, 300))

    await request(app)
      .post('/api/guess')
      .set('Accept', 'application/json')
      .send({ guess: 'PIZZA', game: mockedMultiplayerGame.code, username: 'TestUser', token: '1234' })
      .expect(200)
      .expect('Content-Type', /json/)

    await lobby
  })

  it('tests /api/game/channel - hash failure (pushes update)', async () => {
    await request(app)
      .post('/api/guess')
      .set('Accept', 'application/json')
      .send({ guess: 'PIZZA', game: mockedMultiplayerGame.code, username: 'TestUser2', token: '1234' })
      .expect(200)
      .expect('Content-Type', /json/)

    const req = await request(app)
      .post('/api/game/channel')
      .set('Accept', 'application/json')
      .send({ game: mockedMultiplayerGame.code, username: 'TestUser2', token: '1234', hash: 'incorrect hash' })
      .expect('Content-Type', /json/)
      .expect(200)

    const body = req.body
    expect(body.status).toBe('update')
    expect(body.state).toStrictEqual({
      players: [{ username: 'TestUser' }],
      guesses: [
        {
          player: 'TestUser', colours: ['gray', 'gray', 'gray', 'gray', 'gray']
        },
        {
          player: 'TestUser2', colours: ['gray', 'gray', 'gray', 'gray', 'gray'], guess: 'PIZZA'
        }
      ],
      score: 0
    })
  })

  it('tests /api/game/channel - game ends due to correct word', async () => {
    const lobby = request(app)
      .post('/api/game/channel')
      .set('Accept', 'application/json')
      .send({ game: mockedMultiplayerGame.code, username: 'TestUser2', token: '1234' })
      .expect('Content-Type', /json/)
      .expect(200)
      .then((req) => {
        const body = req.body
        expect(body.status).toBe('end')
        expect(body.guess).toStrictEqual({ player: 'TestUser', colours: ['green', 'green', 'green', 'green', 'green'] })
      })
    await new Promise(resolve => setTimeout(resolve, 300))

    await request(app)
      .post('/api/guess')
      .set('Accept', 'application/json')
      .send({ guess: 'MOUSE', game: mockedMultiplayerGame.code, username: 'TestUser', token: '1234' })
      .expect(200)
      .expect('Content-Type', /json/)

    await lobby
  })
})
