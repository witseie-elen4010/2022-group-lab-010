'use strict'

/* eslint-env jest */

const user = require('../controllers/user.controllers')
// import * as guesses from '../controllers/guesses.controllers'
const express = require('express')
const request = require('supertest')
const router = require('../routes/main.routes')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', router)
const db = require('../models/dbTest')
const correctWordSpy = jest.spyOn(user, 'makeNewUser')
correctWordSpy.mockImplementation(() => ({ username: 'MOUSE' }))

/* const vaildWordSpy = jest.spyOn(game, 'wordIsValid')
vaildWordSpy.mockImplementation((word) => {
  const sampleDict = ['mouse', 'house', 'smart', 'pizza']
  return sampleDict.indexOf(word.toLowerCase()) > -1
}) */

let mockedGame

jest.setTimeout(30000)
beforeAll(async () => {
  await db.connect()
  await db.seed()
  // const mockedWord = await user.findOne({ word: 'mouse' }).exec() // force game word to be 'MOUSE'
  await user.generateUser({ username: 'John', password: 'pass', email: 'emai@l', phoneNumber: '2323' })
})

afterAll(async () => {
  db.close()
})

afterEach(() => {
  jest.clearAllMocks()
})
jest.setTimeout(30000)

describe('Testing user loggin in ', function () {
  it('tests /api/user testing if the function was called', async () => {
    // jest.setTimeout(30000)
    expect(correctWordSpy).toHaveBeenCalledTimes(0)
    const res = await request(app)
      .post('/api/user')
      .send({ username: 'Tom', password: 'pass', email: 'emai@l', phoneNumber: '2323' })
      .expect(200)
    // .expect('Content-Type', /json/)

    console.log(res.body)
    // const colour = res.body
    // expect(res.body.usernamee).toBe('John')
    /*

    expect(colour.length).toBe(5)
    expect(colour).toStrictEqual(['green', 'green', 'green', 'green', 'green']) */
  })
  it('testing duplicate names', async () => {
    // jest.setTimeout(30000)
    expect(correctWordSpy).toHaveBeenCalledTimes(0)
    const res = await request(app)
      .post('/api/user')
      .send({ username: 'John', password: 'pass', email: 'emai@l', phoneNumber: '2323' })

      .expect('Content-Type', /json/)

    console.log(res.body)
    // const colour = res.body
    // expect(colour.status).toBe(1)
    /*

    expect(colour.length).toBe(5)
    expect(colour).toStrictEqual(['green', 'green', 'green', 'green', 'green']) */
  })
})
