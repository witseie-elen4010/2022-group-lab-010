'use strict'

/* eslint-env jest */

const handlers = require('../controllers/routes.controllers')

describe('Test Handlers', function () {
  // test('hello handler works', () => {
  //   const req = {}
  //   const res = { sendFile: function (input) { this.text = input } }

  //   handlers.hello(req, res)

  //   expect(res.text.replace(/\\/g, '/')).toContain('templates/hello.html')
  // })

  test('splash handler works', () => {
    const req = {}
    const res = { sendFile: function (input) { this.text = input } }

    handlers.splash(req, res)

    expect(res.text.replace(/\\/g, '/')).toContain('templates/splash.html')
  })
  test('privacy handler works', () => {
    const req = {}
    const res = { sendFile: function (input) { this.text = input } }

    handlers.privacy(req, res)

    expect(res.text.replace(/\\/g, '/')).toContain('templates/privacy.html')
  })
})
