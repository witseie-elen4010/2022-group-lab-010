'use strict'

const path = require('path')

function hello (req, res) { res.sendFile(path.join(__dirname, '..', 'templates', 'hello.html')) }

function splash (req, res) { res.sendFile(path.join(__dirname, '..', 'templates', 'splash.html')) }

module.exports = { hello, splash }
