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

const findUserByUsername = async (name) => {
  console.log('Loggin the name ', name)
  const user = await User.findOne({ username: name }).exec()
  console.log('LOGGIN THE USER NAME', user)
  if (user) {
    return user
  }
  return false
}

const logginIn = async (req, res) => {
  console.log('LOGGING IN REQUEST .body', req.body)
  const post = req.body
  const userNamee = post.username
  const pword = post.password
  const userChecker = await User.findOne({ username: userNamee }).exec()
  const passwordChecker = await User.findOne({ password: pword }).exec()
  console.log('1-', userChecker)
  console.log('2-', passwordChecker)
  const userBool = false
  const passwordBool = false

  if (userChecker) {
    console.log(userChecker)

    if (userChecker.password === pword) {
      res.json({ code: 'ok', username: userChecker.username })
    } else {
      res.json({ code: 'error' })
    }
  }
  console.log('1 ', userBool)
  console.log('2', passwordBool)
}

module.exports = {
  generateUser,
  makeNewUser,
  logginIn
}
