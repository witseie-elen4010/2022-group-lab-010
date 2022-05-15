'use strict'

/* eslint-env jest */

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

// jest.mock('../controllers/game.controllers')
const correctWordSpy = jest.spyOn(game, 'getCorrectWord')
correctWordSpy.mockImplementation(() => 'MOUSE')

afterEach(() => {
  jest.clearAllMocks()
})

describe('Test Guesses Controller', function () {
  it('tests /api/guess endpoint - Correct word', async () => {
    expect(correctWordSpy).toHaveBeenCalledTimes(0)
    const res = await request(app)
      .post('/api/guess')
      .send({ guess: 'MOUSE' })
      .expect(200)
      .expect('Content-Type', /json/)

    const colour = res.body.colour
    expect(correctWordSpy).toHaveBeenCalledTimes(1)
    expect(colour.length).toBe(5)
    expect(colour).toStrictEqual(['green', 'green', 'green', 'green', 'green'])
  })

  it('tests /api/guess endpoint - First letter wrong', async () => {
    expect(correctWordSpy).toHaveBeenCalledTimes(0)
    const res = await request(app)
      .post('/api/guess')
      .send({ guess: 'HOUSE' })
      .expect(200)
      .expect('Content-Type', /json/)

    const colour = res.body.colour
    expect(correctWordSpy).toHaveBeenCalledTimes(1)
    expect(colour.length).toBe(5)
    expect(colour).toStrictEqual(['gray', 'green', 'green', 'green', 'green'])
  })

  it('tests /api/guess endpoint - Most letters wrong', async () => {
    expect(correctWordSpy).toHaveBeenCalledTimes(0)
    const res = await request(app)
      .post('/api/guess')
      .send({ guess: 'SMART' })
      .expect(200)
      .expect('Content-Type', /json/)

    const colour = res.body.colour
    expect(correctWordSpy).toHaveBeenCalledTimes(1)
    expect(colour.length).toBe(5)
    expect(colour).toStrictEqual(['yellow', 'yellow', 'gray', 'gray', 'gray'])
  })

  it('tests /api/guess endpoint - All letters wrong', async () => {
    expect(correctWordSpy).toHaveBeenCalledTimes(0)
    const res = await request(app)
      .post('/api/guess')
      .send({ guess: 'PIZZA' })
      .expect(200)
      .expect('Content-Type', /json/)

    const colour = res.body.colour
    expect(correctWordSpy).toHaveBeenCalledTimes(1)
    expect(colour.length).toBe(5)
    expect(colour).toStrictEqual(['gray', 'gray', 'gray', 'gray', 'gray'])
  })

  it('tests /api/guess endpoint - Too Long Word', async () => {
    expect(correctWordSpy).toHaveBeenCalledTimes(0)
    await request(app)
      .post('/api/guess')
      .send({ guess: 'MOUSES' })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('tests /api/guess endpoint - Too Short Word', async () => {
    expect(correctWordSpy).toHaveBeenCalledTimes(0)
    await request(app)
      .post('/api/guess')
      .send({ guess: 'MICE' })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('tests /api/guess endpoint - Invalid word', async () => {
    expect(correctWordSpy).toHaveBeenCalledTimes(0)
    await request(app)
      .post('/api/guess')
      .send({ guess: 'ASDFS' })
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
