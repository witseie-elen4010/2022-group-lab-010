'use strict'
const User = require('../models/user')
// connected the database
const generateUser = async (username, password, email, phoneNumber, loggedIn) => {
  // Get a random word from the database

  // console.log(User)
  // console.log(word)

  const user = {
    username,
    password,
    email,
    phoneNumber,
    loggedIn
  }

  const result = await User.create(user).catch(error => {
    console.log('User name is already taken ', error)
    return null
  })
  return result
}

const makeNewUser = async (req, res) => {
//  console.log('making a new user', req)
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
    res.json({ code: 'ok', message: 'Welcome back ' + user.username, status: 1, usernamee: post.username })
  } else {
    console.log(post)
    user = await generateUser(post.username, post.password, post.email, post.phoneNumber, post.loggedIn)
    if (user) {
      res.json(user)
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
  makeNewUser
}
