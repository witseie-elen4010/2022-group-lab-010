'use strict'

const handlers = require('../routes/handlers')

describe('Test Handlers', function () {
  test('hello handler works', () => {
    const req = {}
    const res = { sendFile: function (input) { this.text = input } }

    handlers.hello(req, res)
    expect(res.text.replace(/\\/g, '/')).toContain('templates/hello.html')
  })

  test('splash handler works', () => {
    const req = {}
    const res = { sendFile: function (input) { this.text = input } }

    handlers.splash(req, res)

    expect(res.text).toContain('templates/splash.html')
  })
})
