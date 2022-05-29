const mongoose = require('mongoose')
require('dotenv').config({ path: '../../.env' })
const crypto = require('crypto')
const bcrypt = require('bcrypt')
const saltRounds = 10

// Define schema
const Schema = mongoose.Schema
const PlayerSchema = new Schema(
  {
  // create a player schema only requires ID for now
  // which is created by default

    // -- To do --
    // add user's name
    // add player's email
    // add player's password hash
    /* add player's authentication token list for multiple devices, a token has:
    - Token string
    - Token expiry
    - Token update date
    ...
  */
    username: {
      type: String,
      required: true,
      unique: true
    },
    token: String

  },
  { timestamps: true } // createdAt and updatedAt
)

PlayerSchema.method.generateToken = function (callback) {
  const player = this
  const token = crypto.randomBytes(64).toString('hex')
  player.token = bcrypt.hashSync(saltRounds, token)
  player.save((err, player) => {
    if (err) return callback(err)
    callback(null, token)
  })
  return token
}

module.exports = mongoose.model('Player', PlayerSchema)
