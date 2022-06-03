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
    expect(res.header['content-type']).toBe('text/html; charset=UTF-8')
    expect(res.statusCode).toBe(200)
    expect(res.text).toContain('create an account')
  })
  test('responds to /login with login', async () => {
    const res = await supertest(app).get('/login')
    expect(res.header['content-type']).toBe('text/html; charset=UTF-8')
    expect(res.statusCode).toBe(200)
    expect(res.text).toContain('Please log in or create an account')
  })
  test('responds to /createAccount with createAccount page', async () => {
    const res = await supertest(app).get('/createAccount')
    expect(res.header['content-type']).toBe('text/html; charset=UTF-8')
    expect(res.statusCode).toBe(200)
    expect(res.text).toContain('Create a new account')
  })
})

describe('Test restricted routes', function () {
  test('responds to /splash with login page', async () => {
    const res = await supertest(app).get('/splash')
    expect(res.header['content-type']).toBe('text/plain; charset=utf-8')
    expect(res.statusCode).toBe(302)
    expect(res.text).toContain('Found. Redirecting to /login')
  })

  test('responds to /game with login page', async () => {
    const res = await supertest(app).get('/game')
    expect(res.header['content-type']).toBe('text/plain; charset=utf-8')
    expect(res.statusCode).toBe(302)
    expect(res.text).toContain('Found. Redirecting to /login')
  })

  test('responds to /api/game with login page', async () => {
    const res = await supertest(app).get('/api/game')
    expect(res.header['content-type']).toBe('text/plain; charset=utf-8')
    expect(res.statusCode).toBe(302)
    expect(res.text).toContain('Found. Redirecting to /login')
  })

  test('responds to /api/multiplayer with login page', async () => {
    const res = await supertest(app).get('/api/multiplayer')
    expect(res.header['content-type']).toBe('text/plain; charset=utf-8')
    expect(res.statusCode).toBe(302)
    expect(res.text).toContain('Found. Redirecting to /login')
  })
})
