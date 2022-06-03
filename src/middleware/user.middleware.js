const UserController = require('../controllers/user.controllers')

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
  let user = false
  let search = ''

  if (typeof req.body !== 'undefined' && req.body.username) search = req.body.username

  if (search === '') { // check cookies
    if (req.cookies && req.cookies.username) search = req.cookies.username
  }

  if (!(user = await UserController.findUserByUsername(search))) {
    return unauthorized(req, res)
  }
  // to do check token

  req.user = user // embed the authenticated user in the request

  next()
}

module.exports = {
  auth
}
