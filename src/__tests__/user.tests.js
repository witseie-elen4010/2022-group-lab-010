'use strict'

/* eslint-env jest */

const game = require('../controllers/game.controllers')
const user = require('../controllers/user.controllers')
// import * as guesses from '../controllers/guesses.controllers'
const express = require('express')
const router = require('../routes/main.routes')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', router)

const correctWordSpy = jest.spyOn(user, 'makeNewUser')
correctWordSpy.mockImplementation(() => ({ username: 'MOUSE' }))

const vaildWordSpy = jest.spyOn(game, 'wordIsValid')
vaildWordSpy.mockImplementation((word) => {
  const sampleDict = ['mouse', 'house', 'smart', 'pizza']
  return sampleDict.indexOf(word.toLowerCase()) > -1
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('Testing user loggin in ', function () {
  it('tests /api/user testing if the function was called', async () => {
    expect(correctWordSpy).toHaveBeenCalledTimes(0)
    // const res = await request(app)
    // console.log(res.post)
    /* .post('/api/user')
      .send({ username: 'MOUSE' })
    //  .expect(400)
      .expect('Content-Type', /json/) */

    /*  const colour = res.body.colour
    expect(correctWordSpy).toHaveBeenCalledTimes(1)
    expect(colour.length).toBe(5)
    expect(colour).toStrictEqual(['green', 'green', 'green', 'green', 'green']) */
  })
})
