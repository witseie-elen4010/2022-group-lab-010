const mongoose = require('mongoose')
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const saltRounds = 10

// Define schema
const Schema = mongoose.Schema
const userSchema = new Schema({
  username: { //  a user has one username
    type: String,
    required: true,
    unique: true
  },
  password: { //  a user has one username
    type: String,
    required: true,
    unique: false
  },
  email: { //  a user has one username
    type: String,
    required: true
    // unique: true
  },
  phoneNumber: { //  a user has one username
    type: String,
    required: true

    // unique: true
  },
  loggedIn: {
    type: Boolean,
    required: false

  },
  token: String
})

userSchema.methods.generateToken = function () {
  const player = this
  const token = crypto.randomBytes(64).toString('hex')
  player.token = bcrypt.hashSync(token, saltRounds)
  player.save((err, player) => {
    if (err) {
      console.log('an error occured:', err)
      player.token = null
    }
  })
  return player.token
}

module.exports = mongoose.model('User', userSchema)
