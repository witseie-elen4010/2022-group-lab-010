'use strict'

const path = require('path')
const guessController = require('../controllers/guesses.controllers')

function game (req, res) { res.sendFile(path.join(__dirname, '..', 'templates', 'game.html')) }
function splash (req, res) { res.sendFile(path.join(__dirname, '..', 'templates', 'splash.html')) }
function privacy (req, res) { res.sendFile(path.join(__dirname, '..', 'templates', 'privacy.html')) }
module.exports = { splash, guessController, game, privacy }
