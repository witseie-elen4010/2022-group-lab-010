const UserController = require('../controllers/user.controllers')
const bcrypt = require('bcrypt')

const unauthorized = (req, res) => {
  res.status(401)

  if (req.accepts('html')) {
    res.redirect('/') // redirect to login
  } else if (req.accepts('json')) {
    res.json({ code: 'error', message: 'Unauthorized' })
  }

  return false
}

const auth = async (req, res, next) => {
  let user
  let search = ''
  let token = null

  if (typeof req.body !== 'undefined') {
    if (req.body.username) search = req.body.username
    if (req.body.token) token = req.body.token
  }

  if (req.cookies) { // check cookies
    if (req.cookies.username) search = req.cookies.username
    if (req.cookies.token) token = req.cookies.token
  }

  if (!(user = await UserController.findUserByUsername(search))) {
    return unauthorized(req, res)
  }

  // check if the token is valid
  if (token && await bcrypt.compare(token.toString(), user.token)) {
    // embed the authenticated user in the request
    req.user = user
  } else {
    return (unauthorized(req, res))
  }

  next()
}

module.exports = {
  auth
}
