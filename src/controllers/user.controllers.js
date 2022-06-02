'use strict'
const User = require('../models/User')
// connected the database
const generateUser = async (username) => {
  const user = {
    username
  }

  const result = await User.create(user).catch(error => {
    console.log('User name is already taken ', error)
    return null
  })
  return result
}

const makeNewUser = async (req, res) => {
  const post = req.body
  if (!post) {
    res.status(400).send({
      message: 'Invalid Request Body',
      code: 'error'

    })

    res.end()
  }
  let user
  if ((user = await findUserByUsername(post.username))) {
    res
      .cookie('username', user.username)
      .json({ code: 'ok', message: 'Welcome back ' + user.username })
  } else {
    user = await generateUser(post.username)
    if (user) {
      res
        .cookie('username', user.username)
        .json(user)
    } else {
      res.status(400).send({
        message: 'Invalid Request Body Duplicate name',
        code: 'error'

      })
    }
  }
}

const findUserByUsername = async (username) => {
  const user = await User.findOne({ username }).exec()
  if (user) {
    return user
  }
  return false
}
module.exports = {
  generateUser,
  makeNewUser,
  findUserByUsername
}
