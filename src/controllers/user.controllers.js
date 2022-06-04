'use strict'
const User = require('../models/User')
const bcrypt = require('bcrypt')

const generateUser = async (username, password /*, email, phoneNumber */) => {
  const salt = await bcrypt.genSalt().then(salt => salt)
  const hashedPassword = await bcrypt.hash(password, salt).then(hash => hash)

  const user = {
    username,
    password: hashedPassword /*,
    email,
    phoneNumber */
  }
  const result = await User.create(user).catch(() => {
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
    return
  }

  // validate input
  // if (post.phoneNumber.length !== 10) {
  //   res.status(400).send({
  //     message: 'Invalid phone number',
  //     code: 'error',
  //     feedback: { phoneNumber: 'Invalid phone number' }
  //   })
  //   res.end()
  //   return
  // }

  let user
  if ((user = await findUserByUsername(post.username))) {
    res.json({ code: 'error', message: 'Username is taken', feedback: { username: 'Username is taken' } })
  } else {
    try {
      user = await generateUser(post.username, post.password)
      if (user) {
        const token = await user.generateToken()
        res
          .cookie('username', user.username)
          .cookie('token', token)
        res.json({
          code: 'ok',
          username: user.username,
          token
        })
      } else {
        res.status(400).send({
          message: 'Invalid Request Body Duplicate name',
          code: 'error'

        })
      }
    } catch {
      res.status(500).send('Error In Creating User')
      console.log('Error In Creating User')
    }
  }
}

const findUserByUsername = async (name) => {
  const user = await User.findOne({ username: name }).exec()
  if (user) {
    return user
  }
  return false
}

const login = async (req, res) => {
  const post = req.body
  const username = post.username
  const password = post.password
  const user = await findUserByUsername(username)

  if (user) {
    if (await bcrypt.compare(password, user.password)) {
      const token = await user.generateToken()
      if (!token) return res.status(500).json({ code: 'error', message: 'Server Error' })

      res
        .cookie('username', user.username)
        .cookie('token', token)
        .status(200).json({
          message: 'User authenticated',
          code: 'ok',
          username: user.username,
          token
        })
    } else {
      res.status(401).json({
        message: 'Invalid credentials',
        feedback: { password: 'Invalid credentials' },
        code: 'error'
      })
    }
  } else {
    res.status(401).json({
      message: 'Invalid credentials',
      feedback: { password: 'Invalid credentials' },
      code: 'error'
    })
  }
}

module.exports = {
  generateUser,
  makeNewUser,
  findUserByUsername,
  login
}
