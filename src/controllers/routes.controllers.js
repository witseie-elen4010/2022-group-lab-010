'use strict'

const path = require('path')
const guessController = require('../controllers/guesses.controllers')

function hello (req, res) { res.sendFile(path.join(__dirname, '..', 'templates', 'hello.html')) }
function game (req, res) { res.sendFile(path.join(__dirname, '..', 'templates', 'game.html')) }
function splash (req, res) { res.sendFile(path.join(__dirname, '..', 'templates', 'splash.html')) }
function login (req, res) { res.sendFile(path.join(__dirname, '..', 'templates', 'login.html')) }
function createAccount (req, res) { res.sendFile(path.join(__dirname, '..', 'templates', 'createAccount.html')) }
module.exports = { hello, splash, guessController, game, login, createAccount }
