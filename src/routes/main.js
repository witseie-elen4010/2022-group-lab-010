'use strict'

const handlers = require('./handlers')
const express = require('express')
const router = express.Router()

router.get('/', handlers.splash)

module.exports = router
