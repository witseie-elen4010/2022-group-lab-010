'use strict'

const Player = require('../models/Player')

const getPlayerById = async (playerId) => {
  const player = await Player
    .findById(playerId)
  if (player) {
    return player
  }
  return false
}

const getPlayerByUsername = async (username) => {
  const player = await Player
    .findOne({ username })
    .exec()
  if (player) {
    return player
  }
  return false
}

const register = async (req, res) => {
  const post = req.body
  if (!post) {
    res.status(400).json({
      message: 'Invalid Request Body',
      code: 'error'
    })
    res.end()
    return
  }

  // validation and sanitation would go here
  if (!post.username) {
    res.status(400).json({
      message: "The 'username' parameter is required",
      code: 'error'
    })
  }

  const player = {
    username: post.username
  }
  const result = await Player.create(player)
  result.generateToken((err, token) => {
    if (err) res.status(500).end()
    res.status(201).json({
      message: 'Registered ' + post.username,
      code: 'ok',
      token
    })
  })
}

const authenticate = async (req, res) => {
  const post = req.body
  if (!post) {
    res.status(400).send({
      message: 'Invalid Request Body',
      code: 'error'
    })
    res.end()
    return
  }

  // check if valid player
  if (!post.username) {
    res.status(400).send({
      message: 'Invalid Request Body',
      code: 'error'
    })
    res.end()
    return
  }

  const player = getPlayerByUsername(post.username)
  // todo validate password against hash

  if (player) {
    // generate token and return
    player.generateToken((err, token) => {
      if (err) res.status(500).end()
      res.status(200).json({
        token,
        message: 'accepted',
        code: 'ok'
      })
    })
  } else {
    res.status(401).send({
      message: 'Invalid Credentials',
      code: 'error'
    })
    res.end()
  }
}

module.exports = {
  getPlayerById,
  getPlayerByUsername,
  authenticate,
  register
}
