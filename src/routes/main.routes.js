'use strict'

const handlers = require('../controllers/routes.controllers')
const express = require('express')
const router = express.Router()

router.get('/', handlers.splash)

module.exports = router
