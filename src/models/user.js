const mongoose = require('mongoose')

// Define schema
const Schema = mongoose.Schema
const userSchema = new Schema({
  username: { //  a user has one username
    type: String,
    required: true,
    unique: true
  }
})

module.exports = mongoose.model('User', userSchema)
