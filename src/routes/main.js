'use strict'

const handlers = require('./handlers')
const express = require('express')
const router = express.Router()

router.get('/', handlers.hello)

module.exports = router
