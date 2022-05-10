'use strict'

const path = require('path')

function hello (req, res) { res.sendFile(path.join(__dirname, '..', 'templates', 'hello.html')) }

module.exports = { hello }
