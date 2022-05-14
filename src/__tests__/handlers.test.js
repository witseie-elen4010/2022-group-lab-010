'use strict'

const handlers = require('../routes/handlers')

describe('Test Handlers', function () {
  test('responds to /', () => {
    const req = {}
    const res = { sendFile: function (input) { this.text = input } }

    handlers.hello(req, res)
    expect(res.text.replace(/\\/g, '/')).toContain('templates/hello.html')
  })
})
