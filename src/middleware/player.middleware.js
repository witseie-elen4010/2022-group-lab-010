const Players = require('../controllers/player.controllers')
const bcrypt = require('bcrypt')

const auth = async () => {
  return async (req, res, next) => {
    const post = req.body
    if (!post) {
      res.status(401).send({
        message: 'Invalid Request Body',
        code: 'error'
      })
      res.end()
      return
    }

    // check if valid player, To do: check if player token is valid
    let player
    if (!post.username || (player = await Players.getPlayerByUsername(post.username))) {
      res.status(401).send({
        message: "The 'player' parameter is required",
        code: 'error'
      })
    }

    if (!post.token) {
      res.status(401).send({
        message: "The 'token' parameter is required",
        code: 'error'
      })
    }

    // verify token
    bcrypt.compare(post.token, player.token, (err, result) => {
      if (err) res.status(500).end()
      if (result) next()
    })
  }
}

module.exports = {
  auth
}
