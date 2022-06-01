'use strict'

/* eslint-env jest */

const game = require('../controllers/game.controllers')
const user = require('../controllers/user.controllers')
// import * as guesses from '../controllers/guesses.controllers'
const express = require('express')
const request = require('supertest')
const router = require('../routes/main.routes')
const bodyParser = require('body-parser')

const jsdom = require('jsdom')
const { JSDOM } = jsdom
const dom = new JSDOM('<!DOCTYPE html><p>Hello world</p>')
global.window = dom.window
global.document = window.document

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use('/', router)

const correctWordSpy = jest.spyOn(user, 'makeNewUser')
correctWordSpy.mockImplementation(() => ({
  username: 'username',
  password: 'pass',
  email: 'email',
  phoneNumber: 'num'
}))

afterEach(() => {
  jest.clearAllMocks()
})

describe('Testing user loggin in ', function () {
  it('tests /api/user testing if the function was called', async () => {
    // console.log(correctWordSpy)

    /*  const username = document.getElementById('username').value
    const password = document.getElementById('password').value
    const passwordConfirm = document.getElementById('passwordConfirm').value
    const email = document.getElementById('email').value
    const phone = document.getElementById('phone number').value */

    expect(correctWordSpy).toHaveBeenCalledTimes(0)
    const g = document.createElement('text')
    g.id = 'password'
    document.body.appendChild(g)
    const pc = document.createElement('text')
    pc.id = 'passwordConfirm'
    document.body.appendChild(pc)
  })
})
