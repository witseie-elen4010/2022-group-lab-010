const Players = require('../controllers/user.controllers')

const auth = async (req, res, next) => {
  const post = req.cookies
  if (!post) {
    res.redirect('https://twordledee.azurewebsites.net/')
    res.end()
    return
  }

  if (!post.token) {
    res.redirect('https://twordledee.azurewebsites.net/')
    res.end()
  }

  if (await Players.findUserByToken(post.token)) {
    next()
  } else {
    res.redirect('https://twordledee.azurewebsites.net/')
    res.end()
  }
}

module.exports = {
  auth
}
