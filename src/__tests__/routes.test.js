'use strict'

/* eslint-env jest */

const router = require('../routes/main.routes')
const express = require('express')
const supertest = require('supertest')

const app = express()
app.use('/', router)

describe('Test main routes', function () {
  test('responds to / with splash', async () => {
    const res = await supertest(app).get('/')
    expect(res.statusCode).toBe(200)
  })
  test('responds to /privacy with privacy policy', async () => {
    const res = await supertest(app).get('/privacy')
    expect(res.statusCode).toBe(200)
  })
})

describe('Test restricted routes', function () {
  // test('responds to /splash with login page', async () => {
  //   const res = await supertest(app).get('/')
  //   expect(res.header['content-type'].toLowerCase()).toBe('text/plain; charset=utf-8')
  //   expect(res.statusCode).toBe(302)
  // })

  // test('responds to /game with login page', async () => {
  //   const res = await supertest(app).get('/game')
  //   expect(res.header['content-type'].toLowerCase()).toBe('text/plain; charset=utf-8')
  //   expect(res.statusCode).toBe(302)
  // })

  // test('responds to /api/game with login page', async () => {
  //   const res = await supertest(app).get('/api/game')
  //   expect(res.header['content-type'].toLowerCase()).toBe('text/plain; charset=utf-8')
  //   expect(res.statusCode).toBe(302)
  // })

  // test('responds to /api/multiplayer with login page', async () => {
  //   const res = await supertest(app).get('/api/multiplayer')
  //   expect(res.header['content-type'].toLowerCase()).toBe('text/plain; charset=utf-8')
  //   expect(res.statusCode).toBe(302)
  // })
})
