'use strict'
const User = require('../models/User')
const bcrypt = require('bcrypt')
const sixMonths = 24 * 3600000 * 30 * 6

const generateUser = async (username, password /*, email, phoneNumber */) => {
  const salt = await bcrypt.genSalt().then(salt => salt)
  const hashedPassword = await bcrypt.hash(password, salt).then(hash => hash)

  const user = {
    username,
    password: hashedPassword
  }
  const result = await User.create(user).catch(() => null)

  return result
}

const escapeHtml = (unsafe) => {
  return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;')
}

const changeUserDetails = async (req, res) => {
  const post = req.body

  if (!post || !post.password || await findUserByUsername(post.newUsername)) {
    res.status(400).json({ code: 'error', message: 'Username is taken', feedback: { username: 'Username is taken' } })
    return
  }

  const password = post.password
  let newUsername = ''
  if (typeof post.newUsername !== 'undefined') {
    newUsername = escapeHtml(post.newUsername)
  }

  if (!(await bcrypt.compare(password, req.user.password))) {
    res.status(400).json({ code: 'error', message: 'Incorrect Password', feedback: { username: 'incorrect password' } })
    return
  }

  if (post.newPassword !== '') {
    const salt = await bcrypt.genSalt().then(salt => salt)
    const hashedPassword = await bcrypt.hash(post.newPassword, salt).then(hash => hash)
    req.user.password = hashedPassword
    await req.user.save()
  }
  if (newUsername !== '') {
    req.user.username = newUsername
    await req.user.save()
  }

  res
    .cookie('username', req.user.username, { expires: new Date(Date.now() + (sixMonths)) })
    .json({ code: 'ok', message: 'Details updated' })
}

const makeNewUser = async (req, res) => {
  const post = req.body
  let user
  if (!post || !post.username || (user = await findUserByUsername(post.username))) {
    res.status(400).json({ code: 'error', message: 'Username is taken', feedback: { username: 'Username is taken' } })
  } else {
    user = await generateUser(escapeHtml(post.username), post.password)
    if (user) {
      const token = await user.generateToken()
      res
        .cookie('username', user.username, { expires: new Date(Date.now() + (sixMonths)) })
        .cookie('token', token, { expires: new Date(Date.now() + (sixMonths)) })
      res.json({
        code: 'ok',
        username: user.username,
        token
      })
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
        .cookie('username', user.username, { expires: new Date(Date.now() + (sixMonths)) })
        .cookie('token', token, { expires: new Date(Date.now() + (sixMonths)) })
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
  login,
  changeUserDetails
}
