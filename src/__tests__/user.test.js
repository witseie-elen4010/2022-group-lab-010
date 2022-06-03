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

jest.setTimeout(30000)
beforeAll(async () => {
  await db.connect()
  await db.seed()
  // const mockedWord = await user.findOne({ word: 'mouse' }).exec() // force game word to be 'MOUSE'
  await user.generateUser({ username: 'John', password: 'pass', email: 'emai@l', phoneNumber: '2322323123' })
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
      .send({ username: 'Tom', password: 'pass', email: 'emai@l', phoneNumber: '2322323123' })
      .expect(200)
      .expect('Content-Type', /json/)

    const req = res.body
    expect(req.username).toBe('Tom')
  })
  it('testing duplicate names', async () => {
    // jest.setTimeout(30000)
    expect(correctWordSpy).toHaveBeenCalledTimes(0)
    const res = await request(app)
      .post('/api/user')
      .send({ username: 'John', password: 'pass', email: 'emai@l', phoneNumber: '2322323123' })

      .expect('Content-Type', /json/)

    const req = res.body
    console.log(req)
    expect(req.username).toBe('John')
  })
  it('testing not all data entered', async () => {
    // jest.setTimeout(30000)
    expect(correctWordSpy).toHaveBeenCalledTimes(0)
    const res = await request(app)
      .post('/api/user')
      .send({ username: 'John', password: 'pass', phoneNumber: '' })
      .expect(400)
      .expect('Content-Type', /json/)

    const req = res.body

    expect(req.message).toBe('Invalid phone number')
    expect(req.code).toBe('error')
  })
  it('testing valid user logging in ', async () => {
    // jest.setTimeout(30000)
    expect(correctWordSpy).toHaveBeenCalledTimes(0)
    const res = await request(app)
      .post('/api/LogIn')
      .send({ username: 'John', password: 'pass' })
      .expect(200)
      .expect('Content-Type', /json/)

    const req = res.body
    expect(req.message).toBe('user authenticated')
    expect(req.code).toBe('ok')
  })
  it('testing invalid password when user logging in ', async () => {
    // jest.setTimeout(30000)
    expect(correctWordSpy).toHaveBeenCalledTimes(0)
    const res = await request(app)
      .post('/api/LogIn')
      .send({ username: 'John', password: 'passa' })
      .expect(400)
      .expect('Content-Type', /json/)

    const req = res.body
    // console.log(req)
    expect(req.code).toBe('error')
  })

  it('testing invalid username but  correct password ', async () => {
    expect(correctWordSpy).toHaveBeenCalledTimes(0)
    const res = await request(app)
      .post('/api/LogIn')
      .send({ username: 'Johnaaaa', password: 'pass' })
      .expect(400)
      .expect('Content-Type', /json/)

    const req = res.body
    expect(req.code).toBe('error')
    expect(req.message).toBe('username  invalid')
  })
})
