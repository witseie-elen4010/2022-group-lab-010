'use strict'

const express = require('express')
const path = require('path')
const router = express.Router()

router.get('/', (req, res) => res.sendFile(path.join(__dirname, '..', 'templates', 'hello.html')))

module.exports = router
