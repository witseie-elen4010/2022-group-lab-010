const mongoose = require('mongoose')

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

  }
})

module.exports = mongoose.model('User', userSchema)
