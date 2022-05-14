'use strict'

const router = require('../routes/main.js')
const express = require('express')
const supertest = require('supertest')

const app = express()
app.use('/', router)

describe('Test main routes', function () {
  test('responds to / with splash', async () => {
    const res = await supertest(app).get('/')
    expect(res.header['content-type']).toBe('text/html; charset=UTF-8')
    expect(res.statusCode).toBe(200)
    expect(res.text).toContain('<h1>Welcome to Twordle-dee!</h1>')
  })
})
